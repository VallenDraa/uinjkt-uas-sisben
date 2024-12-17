#include <driver/i2s.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <DHT.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "esp_camera.h"
#include "env.h"

TaskHandle_t camera_task_handler, dht22_and_microphone_task_handler;

// WebSocket Clients
websockets::WebsocketsClient temps_humidity_ws_client;
websockets::WebsocketsClient video_ws_client;
websockets::WebsocketsClient audio_ws_client;


// WiFi and WebSocket Initialization
void init_wifi_and_websockets() {
  WiFi.begin(SSID, PASSWORD);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Connect WebSocket clients
  if (!temps_humidity_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_TEMPS_HUMIDITY_PATH) ||
      !video_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_VIDEO_PATH) ||
      !audio_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_AUDIO_PATH))
  {
    Serial.println("WebSocket connection failed!");
  } else {
    Serial.println("WebSocket connections established.");
  }
}

void init_camera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 9000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_HVGA;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 15;
  config.grab_mode = CAMERA_GRAB_LATEST;
  config.fb_count = 2;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera initialization failed!");
    ESP.restart();
  } else {
    Serial.println("Camera initialized.");
    sensor_t *s = esp_camera_sensor_get();
    s->set_framesize(s, FRAMESIZE_VGA);
    s->set_brightness(s, 1); // up the brightness just a bit
    s->set_vflip(s, 1);      // 0 = disable , 1 = enable
  }
}
void camera_task(void *param) {
  init_camera();

  while (true) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Failed to capture frame!");
    } else {
      video_ws_client.sendBinary((const char *)fb->buf, fb->len);
      Serial.println("Video frame sent.");
      esp_camera_fb_return(fb);
    }
  }
}

void init_microphone() {
  i2s_config_t i2s_config = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
      .sample_rate = SAMPLE_RATE,
      .bits_per_sample = i2s_bits_per_sample_t(16),
      .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
      .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
      .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1, // Atur interrupt
      .dma_buf_count = SAMPLE_BUFFER_COUNT,
      .dma_buf_len = SAMPLE_BUFFER_LENGTH,
      .use_apll = false,
  };

  i2s_pin_config_t i2s_mic_pins = {
      .bck_io_num = I2S_MIC_SERIAL_CLOCK,
      .ws_io_num = I2S_MIC_WORD_SELECT,
      .data_out_num = -1,
      .data_in_num = I2S_MIC_SERIAL_DATA,
  };

  if (i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL) == ESP_OK) {
    i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
    Serial.println("Microphone initialized.");
  } else {
    Serial.println("Microphone initialization failed.");
    ESP.restart();
  }
}
void applyGain(int16_t *buffer, size_t length, float gain) {
  for (size_t i = 0; i < length; i++) {
    int32_t amplified = buffer[i] * gain; // Apply gain
    if (amplified > 32767) {
      amplified = 32767; // Clip to max positive value
    } else if (amplified < -32768) {
      amplified = -32768; // Clip to max negative value
    }
    buffer[i] = amplified; // Write back amplified value
  }
}
void dht22_and_microphone_task(void *param) {
  init_microphone();
  
  DHT dht(DHT_PIN, DHT_TYPE);
  dht.begin();

  unsigned long last_temp_sent_millis = 0;
  int16_t raw_samples[SAMPLE_BUFFER_LENGTH];
  while (true) {
    unsigned long current_millis = millis();
    // DHT22 Data
    if (current_millis - last_temp_sent_millis >= 2000) {
      float humidity = dht.readHumidity();
      float temp_celcius = dht.readTemperature();
      float temp_farenheit = dht.readTemperature(true);

      if (!isnan(humidity) && !isnan(temp_celcius)) {
        String message = "{\"temp_celcius\":" + String(temp_celcius) + ",\"temp_farenheit\":" + String(temp_farenheit) + ",\"humidity\":" + String(humidity) + "}";
        temps_humidity_ws_client.send(message);
        Serial.println("DHT22 data sent: " + message);
      } else {
        Serial.println("Failed to read DHT sensor.");
      }

      last_temp_sent_millis = current_millis;
    }

    // Audio Data
    size_t bytes_read = 0;
    if (i2s_read(I2S_NUM_0, &raw_samples, SAMPLE_BUFFER_LENGTH, &bytes_read, portMAX_DELAY) == ESP_OK) {
      size_t samples_read = bytes_read / sizeof(int16_t);
      applyGain(raw_samples, samples_read, 10);

        
      audio_ws_client.sendBinary((const char *)raw_samples, bytes_read);
      Serial.print("Audio data sent: ");
      for (int i = 0; i < 10; i++) {
        Serial.print(raw_samples[i]);
        Serial.print(" ");
      }
      Serial.println(" ");
    } else {
      Serial.println("Failed to read audio data.");
    }
  }
}

void setup() {
  esp_log_level_set("*", ESP_LOG_DEBUG); // Aktifkan logging dengan level DEBUG
  Serial.begin(115200);
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  init_wifi_and_websockets();

  xTaskCreatePinnedToCore(
    camera_task, "CameraTask", 10000, NULL, 2, &camera_task_handler, 0
  );
  xTaskCreatePinnedToCore(
    dht22_and_microphone_task, "DHT22MicrophoneTask", 10000, NULL, 3, &dht22_and_microphone_task_handler, 1
  );
}

void loop() {
}
