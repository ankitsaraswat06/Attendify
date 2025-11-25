import serial
import time

try:
    esp = serial.Serial("COM6", 115200, timeout=1)
    print("Connected to ESP32!")
except:
    print("FAILED TO CONNECT TO COM6")
    exit()

while True:
    if esp.in_waiting:
        print("ESP says:", esp.readline().decode().strip())
    time.sleep(0.2)
