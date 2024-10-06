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

# Load the model
model = tf.keras.models.load_model('cnnMulticlassifier.keras')  # Update with your model's path

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

    # Process the uploaded file and make a prediction using the model
    input_data = process_file(file_path)
    predictions = model.predict(input_data)

    # Decode the prediction into human-readable categories
    malware_type = decode_predictions(predictions)
    
    # Get the most common malware type
    most_common_type, most_common_count = Counter(malware_type).most_common(1)[0] if malware_type else ("Unknown", 0)
    
    # Pass back the malware count and most common type
    malware_count = Counter(malware_type)

    # Debugging print statement to check the predictions
    print(f"Malware Predictions: {malware_type[:10]}")
    print(f"Malware Count Summary: {malware_count}")

    return jsonify({
        'message': 'File uploaded and analyzed',
        'malware_count': dict(malware_count),
        'most_common_type': most_common_type,
        'most_common_count': most_common_count
    }), 200

def process_file(file_path):
    # Read the CSV file into a DataFrame
    data = pd.read_csv(file_path)

    # Selecting the features that were used during the model's test run
    features = data[['id', 'spkts', 'sbytes', 'dbytes', 'rate', 'sttl', 'dttl', 
                     'sload', 'dload', 'sinpkt', 'dinpkt', 'sjit', 'djit', 
                     'swin', 'stcpb', 'dtcpb', 'dwin', 'smean', 'dmean', 'response_body_len']]

    # Ensure all values are numeric
    input_data = features.astype(float).to_numpy()

    return input_data

def decode_predictions(predictions):
    # Assuming predictions is an array with shape (number_of_samples, number_of_classes)
    predicted_classes = np.argmax(predictions, axis=1)  # Get the index of the highest probability for each sample

    # Mapping of class indices to actual malware types based on your model's class mapping
    class_labels = ['Analysis', 'Backdoor', 'DoS', 'Exploits', 'Fuzzers', 'Generic', 'Normal', 'Reconnaissance', 'Worms']

    # Convert the predicted class indices to human-readable malware types
    malware_types = [class_labels[index] for index in predicted_classes]

    print("First 10 Decoded Predictions:", malware_types[:10])  # Debugging: Print first 10 decoded predictions

    return malware_types

if __name__ == '__main__':
    app.run(debug=True)