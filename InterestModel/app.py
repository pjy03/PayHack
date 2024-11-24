# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# import numpy as np

# # Initialize Flask app
# app = Flask(__name__)

# # Load the trained model
# model = joblib.load('svm_chain_model.pkl')

# # Function to predict loan_int_rate
# @app.route('/predict', methods=['POST'])
# def predict_loan_int_rate():
#     # Get the input data from the request
#     data = request.get_json()
    
#     loan_amnt = data.get('loan_amnt')
#     loan_intent = data.get('loan_intent')
#     credit_score = data.get('credit_score')
#     loan_term = data.get('loan_term')
    
#     # Encode loan_intent (convert categorical to numerical)
#     loan_intent_encoded = pd.factorize([loan_intent])[0][0]
    
#     # Prepare the input features for prediction
#     input_features = np.array([[loan_amnt, loan_intent_encoded, credit_score, loan_term]])
    
#     # Make prediction
#     predicted_int_rate = model.predict(input_features)
    
#     # Return the predicted loan interest rate as a JSON response
#     return jsonify({'predicted_loan_int_rate': predicted_int_rate[0][0]})

# # Start the Flask app
# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load the trained models
model = joblib.load('svm_chain_model.pkl')  # For loan interest rate prediction
loaded_model = joblib.load('logistic_regression_model.pkl')  # For credit score default prediction

# Load the transformed data
id_curr_transformed_loaded = joblib.load("id_curr_transformed.pkl")

# Function to predict loan interest rate
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

# Function to predict probability of credit default
@app.route('/predict_credit_default', methods=['GET'])
def predict_credit_default():
    # Use the saved logistic regression model to predict default probability
    id_curr_prob = loaded_model.predict_proba(id_curr_transformed_loaded)[:, 1][0]
    
    # Return the probability of default as a JSON response
    return jsonify({
        'probability_of_default': f"{id_curr_prob * 100:.2f}%",
        'description': "Probability of credit default for a specific ID_CURR."
    })

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
