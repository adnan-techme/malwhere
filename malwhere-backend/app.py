from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import tensorflow as tf
import pandas as pd
import numpy as np
from collections import Counter
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set up database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Load the model
model = tf.keras.models.load_model('cnnMulticlassifier.keras') 

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Define User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)

# Define ScanHistory Model
class ScanHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(100), nullable=False)
    date_scanned = db.Column(db.DateTime, default=datetime.utcnow)
    malware_type = db.Column(db.String(50), nullable=False)
    scan_result = db.Column(db.String(50), nullable=False)

# Create the database tables (Run only once, or handle it in a separate script)
with app.app_context():
    db.create_all()

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

    # Save scan result to database
    scan_result = "Malware Detected" if most_common_type != "Normal" else "No Malware Detected"
    new_scan = ScanHistory(
        file_name=filename,
        malware_type=most_common_type,
        scan_result=scan_result
    )
    db.session.add(new_scan)
    db.session.commit()

    # Debugging print statement to check the predictions
    print(f"Malware Predictions: {malware_type[:10]}")
    print(f"Malware Count Summary: {malware_count}")

    return jsonify({
        'message': 'File uploaded and analyzed',
        'malware_count': dict(malware_count),
        'most_common_type': most_common_type,
        'most_common_count': most_common_count
    }), 200

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(data['password'], method='scrypt')
    new_user = User(username=data['username'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"username": user.username, "role": user.role} for user in users]
    return jsonify(users_list), 200

@app.route('/users/<username>', methods=['DELETE'])
def delete_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return '', 204

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful", "role": user.role}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/scan-history', methods=['GET'])
def get_scan_history():
    history = ScanHistory.query.all()
    return jsonify([{
        'fileName': record.file_name,
        'dateScanned': record.date_scanned,
        'malwareType': record.malware_type,
        'scanResult': record.scan_result
    } for record in history])

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