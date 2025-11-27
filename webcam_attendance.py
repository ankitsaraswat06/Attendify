
import face_recognition

import pickle

import cv2


import os

import numpy as np

import pandas as pd



from datetime import datetime

REGISTER_DIR = "registered_faces"
ATTENDANCE_FILE = "attendance.csv"

# Load all registered faces
encodings_db = {}
for file in os.listdir(REGISTER_DIR):
    if file.endswith(".pkl"):
        name = file.replace(".pkl", "")
        with open(os.path.join(REGISTER_DIR, file), "rb") as f:
            encodings_db[name] = pickle.load(f)

print(f"Loaded {len(encodings_db)} registered students.")

# Initialize webcam
#new change

# new change in video capture
video_capture = cv2.VideoCapture(0)


def mark_attendance(student_name):
    now = datetime.now()

    # If file doesn't exist or is empty, create a new DataFrame with columns
    if not os.path.exists(ATTENDANCE_FILE) or os.stat(ATTENDANCE_FILE).st_size == 0:
        df = pd.DataFrame(columns=["Name", "Date", "Time"])
    else:
        df = pd.read_csv(ATTENDANCE_FILE)

    # Check if student already marked for today
    today_str = str(now.date())
    if not ((df['Name'] == student_name) & (df['Date'] == today_str)).any():
        df = pd.concat([df, pd.DataFrame([{
            "Name": student_name,
            "Date": now.date(),
            "Time": now.time().strftime("%H:%M:%S")
        }])], ignore_index=True)
        df.to_csv(ATTENDANCE_FILE, index=False)
        print(f"Attendance marked for {student_name} at {now.time().strftime('%H:%M:%S')}")

marked_today = set()  # Keep track of students already marked in this session

cv2.namedWindow("FaceCam Attendance", cv2.WINDOW_NORMAL)
cv2.resizeWindow("FaceCam Attendance", 640, 480)  # Width x Height

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (400, 300))
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    # Calculate scaling factors to map small frame coordinates back to original
    scale_x = frame.shape[1] / small_frame.shape[1]
    scale_y = frame.shape[0] / small_frame.shape[0]

    for face_encoding, face_location in zip(face_encodings, face_locations):
        # Compare with registered encodings
        matches = []
        names = []
        distances = []

        for name, known_encoding in encodings_db.items():
            distance = np.linalg.norm(known_encoding - face_encoding)
            distances.append(distance)
            matches.append(distance < 0.6)
            names.append(name)

        if any(matches):
            best_match_index = np.argmin(distances)
            name = names[best_match_index]

            # Only mark attendance if not already marked this session
            if name not in marked_today:
                mark_attendance(name)
                marked_today.add(name)
                print(f"{name} marked, closing webcam...")
                video_capture.release()
                cv2.destroyAllWindows()
                exit(0)

        # Rescale coordinates to original frame size
        top, right, bottom, left = face_location
        top = int(top * scale_y)
        right = int(right * scale_x)
        bottom = int(bottom * scale_y)
        left = int(left * scale_x)

        # Draw rectangle and label
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name if any(matches) else "Unknown",
                    (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                    (0, 255, 0) if any(matches) else (0, 0, 255), 2)

    cv2.imshow('FaceCam Attendance', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()

