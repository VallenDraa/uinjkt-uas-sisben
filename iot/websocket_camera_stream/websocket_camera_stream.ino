#include <driver/i2s.h>
#include "esp_camera.h"
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <DHT.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "fb_gfx.h"
#include "soc/soc.h"           //disable brownout problems
#include "soc/rtc_cntl_reg.h"  //disable brownout problems
#include "driver/gpio.h"
#include <math.h>
#include "env.h"

// Websocket and wifi configuration
websockets::WebsocketsClient temps_humidity_ws_client;
websockets::WebsocketsClient video_ws_client;
websockets::WebsocketsClient audio_ws_client;

uint8_t state = 0;
void on_message_callback(websockets::WebsocketsMessage message) {
  Serial.print("Got Message: ");
  Serial.println(message.data());
}
esp_err_t init_wifi() {
  WiFi.begin(SSID, PASSWORD);
  Serial.println("Wifi init ");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi OK");
  Serial.println("connecting to WS: ");

  temps_humidity_ws_client.onMessage(on_message_callback);
  video_ws_client.onMessage(on_message_callback);
  audio_ws_client.onMessage(on_message_callback);

  bool is_temps_humidity_connected = temps_humidity_ws_client.connect(
    WS_SERVER_HOST,
    WS_SERVER_PORT,
    WS_TEMPS_HUMIDITY_PATH);
  bool is_video_connected = video_ws_client.connect(
    WS_SERVER_HOST,
    WS_SERVER_PORT,
    WS_VIDEO_PATH);
  bool is_audio_connected = audio_ws_client.connect(
    WS_SERVER_HOST,
    WS_SERVER_PORT,
    WS_AUDIO_PATH);

  if (
    !is_temps_humidity_connected || !is_video_connected || !is_audio_connected) {
    Serial.println("WS connect failed!");
    Serial.println(WiFi.localIP());
    state = 3;

    return ESP_FAIL;
  }

  if (state == 3) {
    return ESP_FAIL;
  }

  Serial.println("WS OK");
  return ESP_OK;
}

// Wrover camera configuration
camera_fb_t *fb = NULL;
size_t _jpg_buf_len = 0;
uint8_t *_jpg_buf = NULL;
esp_err_t init_camera() {
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

  // parameters for image quality and size
  config.frame_size = FRAMESIZE_VGA;  // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
  config.jpeg_quality = 10;           // 10-63 lower number means higher quality
  config.fb_count = 2;
  config.grab_mode = CAMERA_GRAB_LATEST;

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("camera init FAIL: 0x%x", err);
    return err;
  }

  sensor_t *s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_VGA);
  s->set_vflip(s, 1);         // flip it back
  s->set_brightness(s, 0.5);  // up the brightness just a bit

  Serial.println("camera init OK");
  return ESP_OK;
}
void send_video_stream() {
  camera_fb_t *fb = esp_camera_fb_get();

  if (!fb) {
    Serial.println("video image frame capture failed");
    esp_camera_fb_return(fb);
    ESP.restart();
  }

  video_ws_client.sendBinary((const char *)fb->buf, fb->len);
  Serial.println("video frame sent");
  esp_camera_fb_return(fb);
}

// DHT22 configuration
DHT dht(DHT_PIN, DHT_TYPE);
void send_temps_and_humidity_stream() {
  float humidity = dht.readHumidity();
  float temp_celcius = dht.readTemperature();
  float temp_farenheit = dht.readTemperature(true);

  if (isnan(humidity) || isnan(temp_celcius) || isnan(temp_farenheit)) {
    Serial.println(F("Failed to read from DHT sensor!"));

    return;
  }

  // Construct JSON message
  String jsonMessage = "{\"temp_celcius\": " + String(temp_celcius, 1) + ", \"temp_farenheit\": " + String(temp_farenheit, 1) + ", \"humidity\": " + String(humidity, 1) + "}";

  // Send JSON message through WebSocket
  temps_humidity_ws_client.send(jsonMessage);
  Serial.println("JSON message sent:");
  Serial.println(jsonMessage);
}

// INMP 441 configuration
int32_t raw_samples[SAMPLE_BUFFER_SIZE];
void init_inmp_441() {
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };

  i2s_pin_config_t i2s_mic_pins = {
    .bck_io_num = I2S_MIC_SERIAL_CLOCK,
    .ws_io_num = I2S_MIC_LEFT_RIGHT_CLOCK,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_MIC_SERIAL_DATA
  };

  i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
}
void send_sound_stream() {
  // read from the I2S device
  size_t bytes_read = 0;
  esp_err_t result = i2s_read(
    I2S_NUM_0,
    raw_samples,
    sizeof(int32_t) * SAMPLE_BUFFER_SIZE,
    &bytes_read,
    portMAX_DELAY);

  if (result == ESP_OK) {
    audio_ws_client.sendBinary((const char *)raw_samples, bytes_read);
    Serial.println("Audio data sent.");
  } else {
    Serial.println("Failed to read audio data.");
  }
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);
  Serial.print(SSID);

  init_wifi();
  // init_inmp_441();
  init_camera();
  dht.begin();
}

void loop() {
  unsigned long current_millis = millis();

  // Send temperature and humidity in a throttled manner
  static unsigned long last_temp_sent_millis = 0;
  if (current_millis - last_temp_sent_millis >= 1000) {
    send_temps_and_humidity_stream();
    last_temp_sent_millis = current_millis;
  }

  send_video_stream();
  // send_sound_stream();

  temps_humidity_ws_client.poll();
  video_ws_client.poll();
  audio_ws_client.poll();
}
