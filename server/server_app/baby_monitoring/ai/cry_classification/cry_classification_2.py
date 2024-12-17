import os
import torch
import librosa
from transformers import (
    AutoFeatureExtractor,
    AutoModelForAudioClassification,
)

# Load the model and feature extractor
model_name = "Wiam/distilhubert-finetuned-babycry-v7"
model = AutoModelForAudioClassification.from_pretrained(
    pretrained_model_name_or_path=model_name
)
feature_extractor = AutoFeatureExtractor.from_pretrained(
    pretrained_model_name_or_path=model_name
)


def predict_audio(file_path):
    """
    Predict the label of an audio file.

    Args:
        file_path (str): Path to the audio file.

    Returns:
        str: Predicted label.
    """
    try:
        # Step 1: Load the audio file
        audio, sample_rate = librosa.load(file_path, sr=16000)  # Resample to 16kHz

        # Step 2: Extract features using the feature extractor
        inputs = feature_extractor(
            audio, sampling_rate=sample_rate, return_tensors="pt", padding=True
        )

        # Step 3: Pass the features to the model
        with torch.no_grad():  # Disable gradient computation
            outputs = model(**inputs)

        # Step 4: Get the predicted class (argmax over logits)
        predicted_class_id = torch.argmax(outputs.logits, dim=-1).item()

        # Step 5: Map the class ID to the label
        labels = model.config.id2label  # Fetch label mapping from model config
        predicted_label = labels[predicted_class_id]

        return predicted_label

    except Exception as e:
        print(f"Error occurred during prediction: {e}")
        return "Error: Unable to predict"


# Example usage
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "Record (online-voice-recorder.com).mp3")

result = predict_audio(file_path)
print(f"Predicted label: {result}")
