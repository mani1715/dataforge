from flask import Blueprint, request, jsonify, send_file
import pandas as pd
import io

# Import our logic from Stage 1
from services.profiler import DataProfiler

# Create a Blueprint
data_bp = Blueprint('data', __name__)

# We will store the dataframe in memory
CURRENT_DF = None

@data_bp.route('/upload', methods=['POST'])
def upload_file():
    global CURRENT_DF
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # 1. Ingestion
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400

        # 2. Save to memory
        CURRENT_DF = df

        # 3. Profile (Updated with Chart Data)
        summary = DataProfiler.get_summary(df)
        score = DataProfiler.calculate_quality_score(df)
        chart_data = DataProfiler.get_chart_data(df) # NEW LINE
        
        # 4. Prepare Response
        response = {
            'message': 'File uploaded successfully',
            'filename': file.filename,
            'quality_score': score,
            'summary': summary,
            'chart_data': chart_data, # NEW LINE
            'preview': df.head(20).fillna("NaN").to_dict(orient='records')
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_bp.route('/download', methods=['GET'])
def download_file():
    global CURRENT_DF
    if CURRENT_DF is None:
        return jsonify({'error': 'No data available'}), 400

    output = io.StringIO()
    CURRENT_DF.to_csv(output, index=False)
    output.seek(0)

    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name='cleaned_dataforge_dataset.csv'
    )

# Helper functions
def get_current_df():
    return CURRENT_DF

def set_current_df(df):
    global CURRENT_DF
    CURRENT_DF = df