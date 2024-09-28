from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import tensorflow as tf
import pandas as pd
import numpy as np
from collections import Counter

app = Flask(__name__)
CORS(app) 

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = tf.keras.models.load_model('CNNLSTM.keras')  # Update with our desired model's path (IMPORTANT)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Process the uploaded file and make a prediction
    input_data = process_file(file_path)
    predictions = model.predict(input_data)

    print("Predictions:", predictions)  # Debugging: Print the predictions to see its structure (TO BE REMOVED)
    print(f"Predictions: {predictions}, Shape: {predictions.shape}")

    malware_type = decode_predictions(predictions)  # Decode the prediction

    return jsonify({'message': 'File uploaded and analyzed', 'malware_type': malware_type}), 200


import pandas as pd

def process_file(file_path):
    # Read the CSV file into a DataFrame
    data = pd.read_csv(file_path)
    
    # Selecting the relevant columns for the model (adjust based on the model's requirements)
    features = data[['dur', 'proto', 'spkts', 'dpkts', 'sbytes', 'dbytes', 'rate', 'sttl', 'dttl']]

    # Convert categorical 'proto' column to one-hot encoding if it's part of the features
    features = pd.get_dummies(features, columns=['proto'], drop_first=True)

    # Ensure all values are numeric (TensorFlow needs all input to be numeric)
    input_data = features.astype(float).to_numpy()

    return input_data


def decode_predictions(predictions):
    # Assuming predictions is an array with shape (number_of_samples, number_of_classes)
    predicted_classes = np.argmax(predictions, axis=1)  # Get the index of the highest probability for each sample

    # Mapping of class indices to actual malware types from the UNSW-NB15 dataset
    class_labels = ['Normal', 'Backdoor', 'Analysis', 'Fuzzers', 'Shellcode', 
                    'Reconnaissance', 'Exploits', 'DoS', 'Worms', 'Generic']

    # Convert the predicted class indices to human-readable malware types
    malware_types = [class_labels[index] for index in predicted_classes]

    # Count how many of each type of malware were found
    malware_count = Counter(malware_types)

    # Create a summary string that shows the user how many of each malware type was found
    summary = "Malware detection summary:\n"
    for malware_type, count in malware_count.items():
        summary += f"{malware_type}: {count} occurrences\n"

    return summary

if __name__ == '__main__':
    app.run(debug=True)
