from flask import Flask
from flask_cors import CORS
from config import Config
import os

# Import the Blueprints
from routes.data_routes import data_bp
from routes.clean_routes import clean_bp

app = Flask(__name__)
app.config.from_object(Config)

# Configure for large file uploads
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB
app.config['UPLOAD_FOLDER'] = '/app/backend/uploads'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register the Routes
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(clean_bp, url_prefix='/api')

@app.route('/')
def index():
    return "DataForge API is Live."

@app.errorhandler(413)
def request_entity_too_large(error):
    return {"error": "File too large. Maximum size is 500MB."}, 413

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001, threaded=True)