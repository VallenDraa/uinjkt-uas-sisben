#include <ArduinoWebsockets.h>
#include <driver/i2s.h>
#include <WiFi.h>
#include "env.h"

websockets::WebsocketsClient audio_ws_client;

// WiFi and WebSocket Initialization
void init_wifi_and_websockets()
{
  WiFi.begin(SSID, PASSWORD);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Connect WebSocket clients
  if (!audio_ws_client.connect(WS_SERVER_HOST, WS_SERVER_PORT, WS_AUDIO_PATH))
  {
    Serial.println("WebSocket connection failed!");
  }
  else
  {
    Serial.println("WebSocket connections established.");
  }
}

int16_t raw_samples[SAMPLE_BUFFER_LENGTH];
void init_microphone()
{
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

  if (i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL) == ESP_OK)
  {
    i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
    Serial.println("Microphone initialized.");
  }
  else
  {
    Serial.println("Microphone initialization failed.");
    ESP.restart();
  }
}
void applyGain(int16_t *buffer, size_t length, float gain)
{
  for (size_t i = 0; i < length; i++)
  {
    int32_t amplified = buffer[i] * gain; // Apply gain
    if (amplified > 32767)
    {
      amplified = 32767; // Clip to max positive value
    }
    else if (amplified < -32768)
    {
      amplified = -32768; // Clip to max negative value
    }
    buffer[i] = amplified; // Write back amplified value
  }
}
void microphone_task()
{
  size_t bytes_read = 0;
  if (i2s_read(I2S_NUM_0, &raw_samples, SAMPLE_BUFFER_LENGTH, &bytes_read, portMAX_DELAY) == ESP_OK)
  {
    size_t samples_read = bytes_read / sizeof(int16_t);
    applyGain(raw_samples, samples_read, 40);

    audio_ws_client.sendBinary((const char *)raw_samples, bytes_read);
    Serial.print("Audio data sent: ");
    for (int i = 0; i < 10; i++)
    {
      Serial.print(raw_samples[i]);
      Serial.print(" ");
    }
    Serial.println(" ");
  }
  else
  {
    Serial.println("Failed to read audio data.");
  }
  audio_ws_client.poll();
}

void setup()
{
  Serial.begin(115200);
  init_wifi_and_websockets();
  init_microphone();
}

void loop()
{
  microphone_task();
}
