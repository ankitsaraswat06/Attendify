import face_recognition
import pickle
import os
import numpy as np
import pandas as pd
from datetime import datetime

REGISTER_DIR = "registered_faces"
ATTENDANCE_FILE = "attendance.csv"

def verify_face(student_name, img_path, tolerance=0.6):
    encoding_path = os.path.join(REGISTER_DIR, f"{student_name}.pkl")
    if not os.path.exists(encoding_path):
        return False, "Student not registered"
    
    with open(encoding_path, "rb") as f:
        known_encoding = pickle.load(f)
    
    image = face_recognition.load_image_file(img_path)
    encodings = face_recognition.face_encodings(image)
    
    if len(encodings) == 0:
        return False, "No face detected in test image"
    
    test_encoding = encodings[0]
    match = face_recognition.compare_faces([known_encoding], test_encoding, tolerance=tolerance)
    distance = np.linalg.norm(known_encoding - test_encoding)
    
    return match[0], f"Distance: {distance:.4f}"

def mark_attendance(student_name):
    now = datetime.now()

    # Check if the file exists and is non-empty
    if not os.path.exists(ATTENDANCE_FILE) or os.stat(ATTENDANCE_FILE).st_size == 0:
        # Create a new DataFrame with columns
        df = pd.DataFrame(columns=["Name", "Date", "Time"])
    else:
        try:
            df = pd.read_csv(ATTENDANCE_FILE)
        except pd.errors.EmptyDataError:
            # If somehow file is empty, recreate DataFrame
            df = pd.DataFrame(columns=["Name", "Date", "Time"])

    # Prevent duplicate attendance for the same student on the same day
    today_str = str(now.date())
    if not ((df['Name'] == student_name) & (df['Date'] == today_str)).any():
        df = pd.concat([df, pd.DataFrame([{
            "Name": student_name,
            "Date": now.date(),
            "Time": now.time().strftime("%H:%M:%S")
        }])], ignore_index=True)
        df.to_csv(ATTENDANCE_FILE, index=False)
        print(f"Attendance marked for {student_name} at {now.time().strftime('%H:%M:%S')}")




# CLI usage
if __name__ == "__main__":
    student_name = input("Enter student name: ")
    img_path = input("Enter path to test image (e.g., data/test1.jpg): ")
    
    match, info = verify_face(student_name, img_path)
    print("Match:", match, info)
    
    if match:
        mark_attendance(student_name)
