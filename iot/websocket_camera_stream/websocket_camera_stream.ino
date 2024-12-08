#include "esp_camera.h"
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <DHT.h>
#include <driver/i2s.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "fb_gfx.h"
#include "soc/soc.h"          //disable brownout problems
#include "soc/rtc_cntl_reg.h" //disable brownout problems
#include "driver/gpio.h"
#include "env.h"
#include <math.h>

// Websocket and wifi configuration
websockets::WebsocketsClient temps_humidity_ws_client;
websockets::WebsocketsClient video_ws_client;
websockets::WebsocketsClient audio_ws_client;

uint8_t state = 0;
void on_message_callback(websockets::WebsocketsMessage message)
{
  Serial.print("Got Message: ");
  Serial.println(message.data());
}
esp_err_t init_wifi()
{
  WiFi.begin(SSID, PASSWORD);
  Serial.println("Wifi init ");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi OK");
  Serial.println("connecting to WS: ");

  temps_humidity_ws_client.onMessage(on_message_callback);
  video_ws_client.onMessage(on_message_callback);

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
      !is_temps_humidity_connected ||
      !is_video_connected ||
      !is_audio_connected)
  {
    Serial.println("WS connect failed!");
    Serial.println(WiFi.localIP());
    state = 3;

    return ESP_FAIL;
  }

  if (state == 3)
  {
    return ESP_FAIL;
  }

  Serial.println("WS OK");
  return ESP_OK;
}

// Wrover camera configuration
camera_fb_t *fb = NULL;
size_t _jpg_buf_len = 0;
uint8_t *_jpg_buf = NULL;
esp_err_t init_camera()
{
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
  config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
  config.jpeg_quality = 10;          // 10-63 lower number means higher quality
  config.fb_count = 2;
  config.grab_mode = CAMERA_GRAB_LATEST;

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK)
  {
    Serial.printf("camera init FAIL: 0x%x", err);
    return err;
  }

  sensor_t *s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_VGA);
  s->set_vflip(s, 1);        // flip it back
  s->set_brightness(s, 0.5); // up the brightness just a bit

  Serial.println("camera init OK");
  return ESP_OK;
}
void send_video_stream()
{
  camera_fb_t *fb = esp_camera_fb_get();

  if (!fb)
  {
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
void send_temps_and_humidity_stream()
{
  float humidity = dht.readHumidity();
  float temp_celcius = dht.readTemperature();
  float temp_farenheit = dht.readTemperature(true);

  if (isnan(humidity) || isnan(temp_celcius) || isnan(temp_farenheit))
  {
    Serial.println(F("Failed to read from DHT sensor!"));

    return;
  }

  // Construct JSON message
  String jsonMessage = "{\"temp_celcius\": " + String(temp_celcius, 1) +
                       ", \"temp_farenheit\": " + String(temp_farenheit, 1) +
                       ", \"humidity\": " + String(humidity, 1) + "}";

  // Send JSON message through WebSocket
  temps_humidity_ws_client.send(jsonMessage);
  Serial.println("JSON message sent:");
  Serial.println(jsonMessage);
}

// INMP 441 configuration
int16_t sBuffer[SOUND_BUFFER_LENGTH];
void init_inmp441()
{
  // Set up I2S Processor configuration
  const i2s_config_t i2s_config = {
      .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX),
      .sample_rate = 16000,
      .bits_per_sample = i2s_bits_per_sample_t(16),
      .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
      .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
      .intr_alloc_flags = 0,
      .dma_buf_count = SOUND_BUFFER_COUNT,
      .dma_buf_len = SOUND_BUFFER_LENGTH,
      .use_apll = false};
  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);

  // Set I2S pin configuration
  const i2s_pin_config_t pin_config = {
      .bck_io_num = I2S_SCK,
      .ws_io_num = I2S_WS,
      .data_out_num = -1,
      .data_in_num = I2S_SD};
  i2s_set_pin(I2S_PORT, &pin_config);

  i2s_start(I2S_PORT);
}
void send_sound_stream() 
{SOUND_BUFFER_LENGTH
  // size_t bytesIn;
  // esp_err_t result = i2s_read(I2S_PORT, &sBuffer, sizeof(sBuffer), &bytesIn, portMAX_DELAY);

  // if (result == ESP_OK) 
  // {
  //   audio_ws_client.sendBinary((const char *)sBuffer, bytesIn);
  //   Serial.println("Audio data sent.");
  // } 
  // else 
  // {
  //   Serial.println("Failed to read audio data.");
  // }

  #define SAMPLE_RATE 16000        // 16 kHz sample rate
  #define FREQUENCY 440            // Frequency of the sine wave (A4 note, 440 Hz)
  #define AMPLITUDE 32000          // Amplitude of the wave (max for 16-bit PCM)
  #define SAMPLES_PER_CYCLE (SAMPLE_RATE / FREQUENCY)

  static int16_t sineWaveBuffer[SAMPLES_PER_CYCLE]; // Buffer for one cycle of sine wave
  static size_t currentSample = 0;

  // Generate the sine wave only once
  if (currentSample == 0) 
  {
    for (size_t i = 0; i < SAMPLES_PER_CYCLE; i++) 
    {
      float angle = (2.0f * M_PI * i) / SAMPLES_PER_CYCLE;
      sineWaveBuffer[i] = (int16_t)(AMPLITUDE * sin(angle));
    }
  }

  // Send the sine wave data as mock audio
  audio_ws_client.sendBinary(
      (const char *)sineWaveBuffer, sizeof(sineWaveBuffer)
  );

  Serial.println("Mock audio data sent.");
}

void setup()
{
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);
  Serial.print(SSID);

  init_wifi();
  init_camera();
  // init_inmp441();
  dht.begin();
}

void loop()
{
  unsigned long current_millis = millis();

  // Send temperature and humidity in a throttled manner
  static unsigned long last_temp_sent_millis = 0;
  if (current_millis - last_temp_sent_millis >= 1000)
  {
    send_temps_and_humidity_stream();
    last_temp_sent_millis = current_millis;
  }

  send_video_stream();
  send_sound_stream();

  temps_humidity_ws_client.poll();
  video_ws_client.poll();
  audio_ws_client.poll();
}
