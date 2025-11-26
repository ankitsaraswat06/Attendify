import face_recognition
import pickle
import os

REGISTER_DIR = "registered_faces"

def register_face(student_name, img_path):
    os.makedirs(REGISTER_DIR, exist_ok=True)
    
    image = face_recognition.load_image_file(img_path)
    encodings = face_recognition.face_encodings(image)
    
    if len(encodings) == 0:
        print("No face detected in this image!")
        return
    
    encoding = encodings[0]
    
    # Save encoding as pickle
    with open(os.path.join(REGISTER_DIR, f"{student_name}.pkl"), "wb") as f:
        pickle.dump(encoding, f)
    
    print(f"Registered {student_name} successfully!")

# CLI usage ---
if __name__ == "__main__":
    student_name = input("Enter student name: ")
    img_path = input("Enter path to student image (e.g., data/student1.jpg): ")
    register_face(student_name, img_path)

