import torch
from PIL import Image
from transformers import (
    AutoFeatureExtractor,
    AutoModelForImageClassification,
)
import cv2

# Load emotion model
emotion_model_name = "rendy-k/face_emotion_recognizer"
emotion_model = AutoModelForImageClassification.from_pretrained(emotion_model_name)
emotion_feature_extractor = AutoFeatureExtractor.from_pretrained(emotion_model_name)

# Load age estimation model
age_model_name = "nateraw/vit-age-classifier"
age_model = AutoModelForImageClassification.from_pretrained(age_model_name)
age_feature_extractor = AutoFeatureExtractor.from_pretrained(age_model_name)


def detect_face_and_baby(image_path: str) -> bool:
    """
    Detects faces in an image and estimates the age of detected faces.
    Returns True if a baby face is found.
    """
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    image = cv2.imread(image_path)
    if image is None:
        return False

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    if len(faces) == 0:
        return False  # No faces detected

    # Check if any face is a baby
    for x, y, w, h in faces:
        # Crop the detected face
        face = image[y : y + h, x : x + w]
        face_pil = Image.fromarray(cv2.cvtColor(face, cv2.COLOR_BGR2RGB))

        # Predict age
        inputs = age_feature_extractor(images=face_pil, return_tensors="pt")
        with torch.no_grad():
            age_outputs = age_model(**inputs)

        # Get predicted age
        logits = age_outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
        predicted_label = age_model.config.id2label[predicted_class_idx]
        predicted_age = int(predicted_label)  # Age is given as an integer label

        print(f"Detected age: {predicted_age}")

        # Check if age corresponds to a baby (arbitrarily defined as <= 3 years)
        if predicted_age <= 3:
            return True

    return False


def predict_is_uncomfortable(image_path: str) -> str:
    """
    Predicts if a baby is uncomfortable based on facial emotion recognition.
    """
    try:
        if not detect_face_and_baby(image_path):
            print("No baby face detected in the picture.")
            return False

        # Process the image for emotion prediction
        image = Image.open(image_path).convert("RGB")
        inputs = emotion_feature_extractor(images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = emotion_model(**inputs)

        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

        labels = emotion_model.config.id2label  # Emotion labels
        predicted_label = labels[predicted_class_idx]
        print("Predicted emotion:", predicted_label)

        # Check for negative emotions indicating discomfort
        return predicted_label in ["anger", "fear", "sad", "disgust"]
    except Exception as e:
        return f"Error: {e}"
