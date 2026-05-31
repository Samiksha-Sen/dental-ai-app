import tensorflow as tf
import os
import numpy as np
from tensorflow.keras.utils import load_img, img_to_array

model = tf.keras.models.load_model("caries_model1.h5")
print("Last layer activation:", model.layers[-1].activation)
print("Last layer configuration:", model.layers[-1].get_config())

# Test prediction on some images in uploads
uploads_dir = "uploads"
files = [f for f in os.listdir(uploads_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))][:10]

for f in files:
    filepath = os.path.join(uploads_dir, f)
    _, h, w, c = model.input_shape
    
    if c == 1:
        img = load_img(filepath, target_size=(h, w), color_mode="grayscale")
    else:
        img = load_img(filepath, target_size=(h, w))
        
    img = img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    
    prediction = model.predict(img, verbose=0)
    val = float(prediction[0][0])
    print(f"File: {f} -> prediction raw: {val:.6f}")
