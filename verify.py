import os
import pickle
from datetime import datetime

import numpy as np
import pandas as pd
import face_recognition


REGISTER_DIR = "registered_faces"
ATTENDANCE_FILE = "attendance.csv"
FACE_TOLERANCE = 0.6


def load_student_encoding(student_name: str):
    """Load the stored face encoding for a student."""
    encoding_path = os.path.join(REGISTER_DIR, f"{student_name}.pkl")

    if not os.path.exists(encoding_path):
        return None, "Student not registered."

    with open(encoding_path, "rb") as file:
        return pickle.load(file), None


def get_face_encoding(image_path: str):
    """Extract face encoding from an image."""
    if not os.path.exists(image_path):
        return None, "Image not found."

    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        return None, "No face detected in image."

    return encodings[0], None


def verify_face(student_name: str, image_path: str, tolerance: float = FACE_TOLERANCE):
    """Compare the stored encoding with the detected face encoding."""
    known_encoding, error = load_student_encoding(student_name)
    if error:
        return False, error

    test_encoding, error = get_face_encoding(image_path)
    if error:
        return False, error

    match = face_recognition.compare_faces([known_encoding], test_encoding, tolerance)[0]
    distance = np.linalg.norm(known_encoding - test_encoding)

    return match, f"Similarity Score: {1 - distance:.4f}"


def init_attendance_file():
    """Ensure attendance file exists with required structure."""
    if not os.path.exists(ATTENDANCE_FILE) or os.stat(ATTENDANCE_FILE).st_size == 0:
        df = pd.DataFrame(columns=["Name", "Date", "Time"])
        df.to_csv(ATTENDANCE_FILE, index=False)


def has_marked_today(df, student_name):
    """Check if attendance is already marked for today."""
    today = str(datetime.now().date())
    return ((df['Name'] == student_name) & (df['Date'] == today)).any()


def mark_attendance(student_name: str):
    """Update attendance for the student if not already marked."""
    init_attendance_file()
    df = pd.read_csv(ATTENDANCE_FILE)

    if has_marked_today(df, student_name):
        return "Attendance already marked today."

    now = datetime.now()
    entry = {
        "Name": student_name,
        "Date": str(now.date()),
        "Time": now.strftime("%H:%M:%S")
    }

    df = pd.concat([df, pd.DataFrame([entry])], ignore_index=True)
    df.to_csv(ATTENDANCE_FILE, index=False)

    return f"Attendance marked: {student_name} at {entry['Time']}"


def main():
    """CLI for testing purposes."""
    student_name = input("Enter registered student name: ")
    image_path = input("Enter path to test image: ")

    match, message = verify_face(student_name, image_path)
    print(message)

    if match:
        print(mark_attendance(student_name))
    else:
        print("Face verification failed!")


if __name__ == "__main__":
    main()
