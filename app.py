from flask import Flask, render_template, request
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import load_img, img_to_array
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)

# ==========================
# CONFIG
# ==========================
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================
# LOAD MODEL
# ==========================
model = tf.keras.models.load_model("caries_model1.h5")

# ==========================
# FILE CHECK
# ==========================
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==========================
# PREDICTION
# ==========================
def predict_caries(filepath):
    try:
        _, h, w, c = model.input_shape

        if c == 1:
            img = load_img(filepath, target_size=(h, w), color_mode='grayscale')
        else:
            img = load_img(filepath, target_size=(h, w))

        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array, verbose=0)

        if prediction.shape[-1] == 1:
            confidence = float(prediction[0][0])
        else:
            confidence = float(np.max(prediction[0]))

        # Risk level logic
        if confidence > 0.8:
            risk = "High Risk"
        elif confidence > 0.6:
            risk = "Moderate Risk"
        else:
            risk = "Low Risk"

        if confidence > 0.5:
            return "Caries Detected", "Surgical Extraction Recommended", round(confidence * 100, 2), risk
        else:
            return "No Caries", "Manual Extraction Possible", round((1 - confidence) * 100, 2), risk

    except Exception as e:
        return "Error", str(e), 0, "Unknown"

# ==========================
# ROUTES
# ==========================
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return render_template('index.html', error="No file uploaded")

    file = request.files['file']

    if file.filename == '':
        return render_template('index.html', error="No file selected")

    if not allowed_file(file.filename):
        return render_template('index.html', error="Invalid file type")

    filename = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    condition, extraction, confidence, risk = predict_caries(filepath)

    return render_template('index.html',
                           difficulty=condition,
                           extraction=extraction,
                           confidence=confidence,
                           risk=risk,
                           image_path=filepath)

# ==========================
# RUN
# ==========================
if __name__ == '__main__':
    app.run(debug=True)