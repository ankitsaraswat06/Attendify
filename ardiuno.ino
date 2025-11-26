#include <WiFi.h>

const char* ssid = "hotspot";
const char* password = "12345678abc";

void setup() {
  Serial.begin(115200);
  delay(2000); // IMPORTANT: allow serial to stabilize

  Serial.println("ESP32_READY");

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
}

void loop() {
  long rssi = WiFi.RSSI();

  if (rssi > -70) {
    Serial.println("IN_RANGE");
  } else {
    Serial.println("OUT_OF_RANGE");
  }

  delay(2000);
}
