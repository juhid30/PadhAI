from flask import Flask, request, jsonify
import numpy as np
import librosa
import pickle

app = Flask(__name__)

# Load the model and scaler
with open('emotion_classifier_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

def extract_features(data, sample_rate):
    # Your existing feature extraction logic
    # ...

def get_prediction(audio_data):
    # Process audio data and make predictions
    features = extract_features(audio_data, sample_rate=22050)
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)
    return prediction[0]

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file:
        audio_data, _ = librosa.load(file, sr=22050)  # Load the audio file
        prediction = get_prediction(audio_data)
        return jsonify({'emotion': prediction}), 200

if __name__ == '__main__':
    app.run(debug=True)
