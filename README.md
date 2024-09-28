# MalWhere
A web application that leverages a hybrid CNN-LSTM machine learning model to scan and analyze malware. This tool allows users to upload files and detects malware using a pre-trained model. It provides a report with a malware breakdown, confidence score, and behavioral analysis of potential threats.

### Instructions
1. Clone the repository
   ```bash
   git clone https://github.com/adnan-techme/malwhere.git
2. Navigate to the backend directory 
   ```bash
   cd malwhere/malwhere-backend
3. Activate the virtual environment (macOS)
   ```bash
   python3 -m venv venv
   source venv/bin/activate
4. Activate the virtual environment (Windows)
   ```bash
   python -m venv venv
   venv\Scripts\activate
5. Install backend dependencies
   ```bash
   pip install -r requirements.txt
6. Run the backend server
   ```bash
   python app.py
7. Navigate to the frontend directory and install dependencies (in another terminal)
   ```bash
   cd malwhere/malwhere-frontend
   npm install
8. Run the frontend server
   ```bash
   npm start


