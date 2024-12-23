#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <DHT.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "esp_camera.h"
#include "env.h"

// WebSocket Clients
websockets::WebsocketsClient temps_humidity_ws_client;
websockets::WebsocketsClient video_ws_client;

// WiFi and WebSocket Initialization
void wifi_and_websockets_init()
{
  WiFi.begin(SSID, PASSWORD);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  bool is_temps_connected = temps_humidity_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_TEMPS_HUMIDITY_PATH);
  bool is_video_connected = video_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_VIDEO_PATH);

  Serial.println(is_temps_connected);
  Serial.println(is_video_connected);

  // Connect WebSocket clients
  if (
      !is_temps_connected || !is_video_connected)
  {
    Serial.println("WebSocket connection failed!");
  }
  else
  {
    Serial.println("WebSocket connections established.");
  }
}

void camera_init()
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
  config.frame_size = FRAMESIZE_SVGA;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 10;
  config.grab_mode = CAMERA_GRAB_LATEST;
  config.fb_count = 2;

  if (esp_camera_init(&config) != ESP_OK)
  {
    Serial.println("Camera initialization failed!");
    ESP.restart();
  }
  else
  {
    Serial.println("Camera initialized.");
    sensor_t *s = esp_camera_sensor_get();
    s->set_framesize(s, FRAMESIZE_VGA);
    s->set_brightness(s, 1); // up the brightness just a bit
    s->set_vflip(s, 1);      // 0 = disable , 1 = enable
  }
}
void camera_task()
{
  camera_fb_t *fb = esp_camera_fb_get();

  if (!fb)
  {
    Serial.println("Failed to capture frame!");
  }
  else
  {
    video_ws_client.sendBinary((const char *)fb->buf, fb->len);
    Serial.println("Video frame sent.");
    esp_camera_fb_return(fb);
  }

  video_ws_client.poll();
}

DHT dht(DHT_PIN, DHT_TYPE);
void dh22_init()
{
  dht.begin();
}
void dht22_task()
{
  float humidity = dht.readHumidity();
  float temp_celcius = dht.readTemperature();
  float temp_farenheit = dht.readTemperature(true);

  if (!isnan(humidity) && !isnan(temp_celcius))
  {
    String message = "{\"temp_celcius\":" + String(temp_celcius) + ",\"temp_farenheit\":" + String(temp_farenheit) + ",\"humidity\":" + String(humidity) + "}";
    temps_humidity_ws_client.send(message);
    Serial.println("DHT22 data sent: " + message);
  }
  else
  {
    Serial.println("Failed to read DHT sensor.");
  }

  temps_humidity_ws_client.poll();
}

void setup()
{
  Serial.begin(115200);
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  wifi_and_websockets_init();
  dh22_init();
  camera_init();

  unsigned long current_millis = millis();
  static unsigned long last_temp_sent_millis = 0;
  if (current_millis - last_temp_sent_millis >= 1500)
  {
    dht22_task();
    last_temp_sent_millis = current_millis;
  }
}
