from flask import Flask, request, jsonify
from flask_cors import CORS
#import tensorflow as tf
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)  # This allows your frontend to connect to the backend

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def classify_video(file_path):
    # Load your deepfake detection model
   # model = tf.keras.models.load_model('path_to_your_model.h5')
    
    # Process the video file and classify it here
    # This is where you'll add your actual model prediction logic
    is_fake = True  # Replace with actual model prediction
    
    return is_fake

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the video with your model
        result = classify_video(filepath)
        
        return jsonify({
            'message': 'Video processed successfully',
            'is_fake': result
        }), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)