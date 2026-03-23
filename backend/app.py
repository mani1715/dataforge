from flask import Flask
from flask_cors import CORS
from config import Config

# Import the Blueprints
from routes.data_routes import data_bp
from routes.clean_routes import clean_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Register the Routes
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(clean_bp, url_prefix='/api')

@app.route('/')
def index():
    return "DataForge API is Live."

if __name__ == '__main__':
    app.run(debug=True, port=5000)