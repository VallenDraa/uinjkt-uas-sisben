import joblib
import librosa
import numpy as np
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths for the model and label files
model_path = os.path.join(script_dir, "model.joblib")
label_path = os.path.join(script_dir, "label.joblib")

loaded_model = joblib.load(model_path)
loaded_le = joblib.load(label_path)


def extract_features(file_path):
    try:
        # Define default parameters
        n_fft = 2048
        hop_length = 512
        win_length = 2048
        window = "hann"
        n_mels = 128
        n_bands = 6
        fmin = 200

        # Load audio file
        y, sr = librosa.load(file_path, sr=16000)

        # Extract features
        mfcc = np.mean(
            librosa.feature.mfcc(
                y=y, sr=sr, n_mfcc=40, n_fft=n_fft, hop_length=hop_length
            ).T,
            axis=0,
        )
        mel = np.mean(
            librosa.feature.melspectrogram(
                y=y, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels
            ).T,
            axis=0,
        )
        stft = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length))
        chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sr).T, axis=0)
        contrast = np.mean(
            librosa.feature.spectral_contrast(
                S=stft, sr=sr, n_bands=n_bands, fmin=fmin
            ).T,
            axis=0,
        )
        tonnetz = np.mean(librosa.feature.tonnetz(y=y, sr=sr).T, axis=0)

        # Combine features
        features = np.concatenate((mfcc, chroma, mel, contrast, tonnetz))

        # Debugging feature size
        print(f"Extracted features shape: {features.shape}")

        # Pad features if necessary
        if features.shape[0] < 194:
            features = np.pad(features, (0, 194 - features.shape[0]), mode="constant")
        elif features.shape[0] > 194:
            features = features[:194]

        return features
    except Exception as e:
        print(f"Error: Exception occurred in feature extraction - {e}")
        return None


def predict_cry(file_path: str):
    # Load the saved model and LabelEncoder
    loaded_model = joblib.load(model_path)
    loaded_le = joblib.load(label_path)

    # Extract features from the new audio file
    features = extract_features(file_path)

    if features is not None:
        # Reshape features to match the input shape expected by the model
        features = features.reshape(1, -1)

        # Make prediction
        prediction = loaded_model.predict(features)

        # Convert prediction back to original label
        predicted_label = loaded_le.inverse_transform(prediction)

        return predicted_label[0]
    else:
        return "Error: Could not extract features from the audio file"


# Example usage
file_path = os.path.join(script_dir, "Record (online-voice-recorder.com).mp3")
result = predict_cry(file_path)
print(f"Predicted cry type: {result}")
