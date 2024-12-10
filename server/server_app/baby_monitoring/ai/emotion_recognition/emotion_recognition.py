# https://www.kaggle.com/datasets/abhisheksingh016/machine-model-for-emotion-detection?resource=download
from random import randint
from django.conf import settings
import cv2
import numpy as np
import warnings
from keras.api.preprocessing import image
from keras.src.saving import load_model

warnings.filterwarnings("ignore")
model = load_model(
    settings.BASE_DIR
    / "baby_monitoring"
    / "ai"
    / "emotion_recognition"
    / "emotion_recognition.h5",
)

face_haar_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


emotions = ("angry", "disgust", "fear", "happy", "sad", "surprise", "neutral")


def predict_emotion(frame):
    # gray_img = cv2.cvtColor(
    #     frame,
    #     cv2.COLOR_BGR2RGB,
    # )
    # faces_detected = face_haar_cascade.detectMultiScale(gray_img)
    # highest_confidence_emotion = None
    # highest_confidence_score = 0

    # for x, y, w, h in faces_detected:
    #     roi_gray = gray_img[y : y + w, x : x + h]
    #     img_pixels = image.img_to_array(roi_gray)
    #     img_pixels = np.expand_dims(img_pixels, axis=1)
    #     img_pixels /= 255

    #     predictions = model.predict(img_pixels)
    #     max_index = np.argmax(predictions[0])
    #     confidence_score = predictions[0][max_index]
    #     predicted_emotion = emotions[max_index]

    #     if confidence_score > highest_confidence_score:
    #         highest_confidence_emotion = predicted_emotion

    # return highest_confidence_emotion

    highest_confidence_emotion = (
        emotions[randint(0, len(emotions)) - 1] if randint(0, 100) < 5 else None
    )

    if highest_confidence_emotion == "angry":
        return "DISCOMFORT"
    elif highest_confidence_emotion == "sad":
        return "CRYING"
