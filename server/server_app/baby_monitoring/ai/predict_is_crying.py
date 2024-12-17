import torch
import librosa
from transformers import (
    AutoFeatureExtractor,
    AutoModelForAudioClassification,
)

model_name = "Marcos12886/distilhubert-finetuned-cry-detector"
model = AutoModelForAudioClassification.from_pretrained(
    pretrained_model_name_or_path=model_name
)
feature_extractor = AutoFeatureExtractor.from_pretrained(
    pretrained_model_name_or_path=model_name
)


def predict_is_crying(file_path):
    try:
        audio, sample_rate = librosa.load(file_path, sr=16000)

        inputs = feature_extractor(
            audio, sampling_rate=sample_rate, return_tensors="pt", padding=True
        )

        with torch.no_grad():
            outputs = model(**inputs)

        predicted_class_id = torch.argmax(outputs.logits, dim=-1).item()

        labels = model.config.id2label  # ['crying', 'no_crying']
        predicted_label = labels[predicted_class_id]

        print("predicted label from audio:", predicted_label)

        return predicted_label == "crying"

    except Exception as e:
        print(f"Error occurred during prediction: {e}")
        return "Error: Unable to predict"
