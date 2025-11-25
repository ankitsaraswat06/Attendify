from fastapi import FastAPI
from fastapi.responses import JSONResponse
import cv2
import face_recognition
import numpy as np
import serial
import os
import time
import csv
from datetime import datetime
import subprocess

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



HOTSPOT_NAME = "hotspot"
SERIAL_PORT = "COM6"
BAUD_RATE = 115200
KNOWN_FACES_DIR = "students"

def is_connected_to_hotspot():
    try:
        result = subprocess.check_output(
            "netsh wlan show interfaces", shell=True
        ).decode(errors="ignore")
        return HOTSPOT_NAME in result
    except:
        return False


@app.get("/take-attendance")
def take_attendance():

    present_students = set()

    # -------------------------------
    # Serial Connection
    # -------------------------------
    try:
        esp = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    except:
        esp = None

    # -------------------------------
    # Load Known Faces
    # -------------------------------
    known_faces = []
    known_names = []

    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            image = face_recognition.load_image_file(os.path.join(KNOWN_FACES_DIR, filename))
            encodings = face_recognition.face_encodings(image)
            if len(encodings) > 0:
                known_faces.append(encodings[0])
                known_names.append(os.path.splitext(filename)[0])

    # -------------------------------
    # WiFi Check
    # -------------------------------
    if not is_connected_to_hotspot():
        return JSONResponse({"error": "Laptop NOT connected to hotspot"}, status_code=400)

    # -------------------------------
    # ESP32 Check Range
    # -------------------------------
    esp_in_range = False
    start = time.time()

    while time.time() - start < 10:
        if esp and esp.in_waiting:
            msg = esp.readline().decode().strip()
            if "IN_RANGE" in msg:
                esp_in_range = True
                break

    if not esp_in_range:
        return JSONResponse({"error": "ESP32 OUT OF RANGE"}, status_code=400)

    # -------------------------------
    # Start Camera
    # -------------------------------
    video_capture = cv2.VideoCapture(0)
    time.sleep(2)
    

    camera_start = time.time()   # IMPORTANT FIX

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        try:
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        except:
            continue

        for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):

            matches = face_recognition.compare_faces(known_faces, encoding)
            if True in matches:
                idx = np.argmin(face_recognition.face_distance(known_faces, encoding))
                name = known_names[idx]
                present_students.add(name)

        # stop after 5 seconds of scanning (FIXED)
        if time.time() - camera_start > 5:
            break

    video_capture.release()
    if esp:
        esp.close()

    # -------------------------------
    # Generate CSV
    # -------------------------------
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv_filename = "attendance.csv"

    with open(csv_filename, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Student Name", "Status", "Time"])

        for s in sorted(known_names):
            status = "Present" if s in present_students else "Absent"
            writer.writerow([s, status, timestamp])

    return {
        "message": "Attendance completed",
        "present": list(present_students),
        "csv_file": csv_filename
    }
