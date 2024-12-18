import torch
from PIL import Image
from transformers import (
    AutoFeatureExtractor,
    AutoModelForImageClassification,
)


emotion_model_name = "rendy-k/face_emotion_recognizer"
emotion_model = AutoModelForImageClassification.from_pretrained(
    pretrained_model_name_or_path=emotion_model_name
)
emotion_feature_extractor = AutoFeatureExtractor.from_pretrained(
    pretrained_model_name_or_path=emotion_model_name
)


def predict_is_uncomfortable(image_path: str) -> str:
    try:
        image = Image.open(image_path).convert("RGB")

        inputs = emotion_feature_extractor(images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = emotion_model(**inputs)

        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

        labels = (
            emotion_model.config.id2label
        )  # ['anger', 'contempt', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        predicted_label = labels[predicted_class_idx]
        print("predicted label from picture:", predicted_label)

        return (
            predicted_label == "anger"
            or predicted_label == "fear"
            or predicted_label == "sad"
            or predicted_label == "disgust"
        )
    except Exception as e:
        return f"Error: {e}"
