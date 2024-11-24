from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load('C:\\Users\\Pu Jun Yu\\Desktop\\PayHack\\PayHack2024\\client\\app\\pages\\api\\svm_chain_model.pkl')

# Function to predict loan_int_rate
@app.route('/predict', methods=['POST'])
def predict_loan_int_rate():
    # Get the input data from the request
    data = request.get_json()
    
    loan_amnt = data.get('loan_amnt')
    loan_intent = data.get('loan_intent')
    credit_score = data.get('credit_score')
    loan_term = data.get('loan_term')
    
    # Encode loan_intent (convert categorical to numerical)
    loan_intent_encoded = pd.factorize([loan_intent])[0][0]
    
    # Prepare the input features for prediction
    input_features = np.array([[loan_amnt, loan_intent_encoded, credit_score, loan_term]])
    
    # Make prediction
    predicted_int_rate = model.predict(input_features)
    
    # Return the predicted loan interest rate as a JSON response
    return jsonify({'predicted_loan_int_rate': predicted_int_rate[0][0]})

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)