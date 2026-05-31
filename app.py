from flask import Flask, request, jsonify, render_template
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import load_img, img_to_array
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load trained model
model = tf.keras.models.load_model("caries_model1.h5")


def predict_caries(filepath):
    # Get expected input size from model
    _, h, w, c = model.input_shape

    # Load image correctly
    if c == 1:
        img = load_img(
            filepath,
            target_size=(h, w),
            color_mode="grayscale"
        )
    else:
        img = load_img(
            filepath,
            target_size=(h, w)
        )

    # Convert image to array
    img = img_to_array(img)

    # Normalize
    img = img / 255.0

    # Add batch dimension
    img = np.expand_dims(img, axis=0)

    # Predict
    prediction = model.predict(img, verbose=0)

    print("Raw Prediction:", prediction)

    confidence = float(prediction[0][0])

    # Binary classification
    if confidence >= 0.5:
        condition = "Caries Found"
        extraction = "Go for surgical extraction"
        confidence_percent = confidence * 100
    else:
        condition = "No Caries Detected"
        extraction = "Go for manual extraction"
        confidence_percent = (1 - confidence) * 100

    return (
        condition,
        extraction,
        round(confidence_percent, 2)
    )


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({
            "error": "No file uploaded"
        })

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        })

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)

    condition, extraction, confidence = predict_caries(filepath)

    return jsonify({
        "condition": condition,
        "extraction": extraction,
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )