import os

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

server_user_id = None
aspects = [
    "Bank Account Insights",
    "Transactional Behavior",
    "Loan Repayment Records",
    "Cash Flow Stability",
    "Debt Obligations",
    "Credit Utilization",
    "Demographics and Employment",
    "Behavioral Loan Insights"
]


model_category_map = {
    "Bank Account Insights": "model_Bank_Account_Insights.joblib",
    "Transactional Behavior": "model_Transactional_Behavior.joblib",
    "Loan Repayment Records": "model_Loan_Repayment_Records.joblib",
    "Cash Flow Stability": "model_Cash_Flow_Stability.joblib",
    "Debt Obligations": "model_Debt_Obligations.joblib",
    "Credit Utilization": "model_Credit_Utilization.joblib",
    "Demographics and Employment": "model_Demographics_and_Employment.joblib",
    "Behavioral Loan Insights": "model_Behavioral_Loan_Insights.joblib"
}

feature_groups = {
    "Bank Account Insights": [
        "BALANCE_TO_CREDIT_LIMIT_RATIO", "ATM_DRAWINGS_RATIO", 
        "POS_OTHER_DRAWINGS_RATIO", "MAX_POS_OTHER_DRAWINGS", 
        "STD_OUTFLOWS"
    ],
    "Transactional Behavior": [
        "INST_MIN_PAYMENT_RATIO", "PAYMENT_TO_RECEIVABLE_RATIO", 
        "RECEIVABLE_PRINCIPAL_RATIO"
    ],
    "Loan Repayment Records": [
        "AVG_DPD", "MAX_DPD", "MIN_DPD", "TOTAL_CONSECUTIVE_OVERDUE", 
        "TOTAL_CREDIT_DAY_OVERDUE", "AVG_SK_DPD", "MAX_SK_DPD", 
        "TOTAL_OVERDUE_MONTHS_SK_DPD", "AVG_SK_DPD_DEF", 
        "MAX_SK_DPD_DEF", "TOTAL_OVERDUE_MONTHS_SK_DPD_DEF"
    ],
    "Cash Flow Stability": [
        "ATM_COUNT_RATIO", "MAX_CNT_DRAWINGS_ATM", 
        "POS_OTHER_COUNT_RATIO", "MAX_CNT_DRAWINGS_POS_OTHER", 
        "STD_INFLOWS"
    ],
    "Debt Obligations": [
        "RATIO_DEBT_CREDIT"
    ],
    "Credit Utilization": [
        "RATIO_GOOD_TO_BAD", "RATIO_OVERDUE_CREDIT", 
        "RATIO_OVERDUE_DEBT", "RATIO_MAX_OVERDUE_CREDIT"
    ],
    "Demographics and Employment": [
        "NAME_CONTRACT_TYPE", "AMT_CREDIT", "AMT_ANNUITY", 
        "LOAN_TYPE_RATIO"
    ],
    "Behavioral Loan Insights": [
        "COUNT_NO_EXCEED", "COUNT_EXCEED", "TOTAL_PROLONG", 
        "AVG_CREDIT_DURATION", "AVG_ENDDATE_DIFF", 
        "AVG_LOAN_PROLONG", "RATIO_DAYS_OVERDUE_CREDIT_DURATION"
    ]
}

# Dynamically determine the location of the model file
base_dir = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
interest_model = joblib.load("svm_chain_model.pkl")
contract_label_encoder = joblib.load(os.path.join(base_dir,'name_contract_type_encoder.pkl'))

model_map = {}
for aspect in aspects:
    model_path = os.path.join(base_dir, model_category_map[aspect])  # Combine with the model filename
    model_map[aspect] = joblib.load(model_path)

# @app.before_first_request
# def load_csv():
#     global user_data
#     user_data = pd.read_csv(os.path.join(base_dir,"application_train_merge.csv"))
#     print("CSV file loaded successfully.")
          
def get_model_features(aspect):
    return feature_groups[aspect]

# Function to get user data for a specific model
def get_user_data_for_model(user_data,user_id, aspect):
    # Select model file
    model = model_map.get(aspect)
    if not model:
        raise ValueError(f"No model found for aspect: {aspect}")

    # Get the features that the model requires (this should be part of the model or predefined)
    # Example: you might have a predefined list of feature columns per model
    model_features = get_model_features(aspect)  # This function should return the required features for the model
    # user_data = pd.read_csv(os.path.join(base_dir,"application_train_merge.csv"))

    # Grab user data based on ID
    user_data = user_data[user_data['SK_ID_CURR'] == user_id]

    if user_data.empty:
        raise ValueError(f"No user found with ID: {user_id}")

    # Select only the relevant columns based on model's input features
    user_data = user_data[model_features]
    return user_data

def get_lender_weights(lender_id):
    
    lender_path = os.path.join(base_dir, "lender_weights.csv")
    lender_data = pd.read_csv(lender_path)
    # Check if the lender_id exists in the data
    if lender_id not in lender_data["Lender_ID"].values:
        return jsonify({"error": f"Lender ID '{lender_id}' not found"}), 404

    # Extract the weightages for the lender
    weightages = lender_data.loc[lender_data["Lender_ID"] == lender_id, 
                                    ["Bank Account Insights","Transactional Behavior","Loan Repayment Records","Cash Flow Stability",
    "Debt Obligations","Credit Utilization","Demographics and Employment","Behavioral Loan Insights"]].values.flatten().tolist()

    return weightages


@app.route('/predict_credit', methods=['POST'])
def predict_credit_api():
    # Get the input data from the request
    data = request.get_json()
    user_id = data.get('user_id')
    lender_id = data.get('lender_id')

    return predict_credit(user_id,lender_id)

def predict_credit(user_id, lender_id):
    user_data = pd.read_csv(os.path.join(base_dir,"application_train_merge.csv"))
    weights = get_lender_weights(lender_id)

    result = {}
    for aspect in aspects:
        user_aspect_data = get_user_data_for_model(user_data,user_id,aspect)
        if aspect == "Demographics and Employment":
            user_aspect_data['NAME_CONTRACT_TYPE'] = contract_label_encoder.transform(user_aspect_data['NAME_CONTRACT_TYPE'])
        model = model_map[aspect]
        print(aspect)
        predicted_score = model.predict_proba(user_aspect_data)[:,0].tolist()
        result[aspect] = predicted_score[0]

    print(weights)
    print(result.values)
    final_result = sum(list(map(lambda x, y: x * y, weights, list(result.values()))))
    result["total"] = final_result 

    print(result)
    return jsonify(result)

@app.route('/predict_interest', methods=['POST'])
def predict_interest():
    # Get the input data from the request
    data = request.get_json()
    user_id = data.get('user_id')
    lender_id = data.get('lender_id')

    loan_amnt = data.get('loan_amnt')
    loan_intent = data.get('loan_intent')
    credit_score = predict_credit(user_id,lender_id).get_json()["total"]
    loan_term = data.get('loan_term')
    print(credit_score)
    loan_intent_encoded = pd.factorize([loan_intent])[0][0]

    range_score =  850 - 300
    credit_score = 350 + (credit_score * range_score)
    # Prepare the input features for prediction
    input_features = np.array([[loan_amnt, loan_intent_encoded, credit_score, loan_term]])

    # Make prediction
    predicted_int_rate = interest_model.predict(input_features)[0][0]
    print(predicted_int_rate)
    # Return the predicted loan interest rate as a JSON response
    return jsonify({"interest_rate":predicted_int_rate})

@app.route('/set_weight', methods=['POST'])
def set_lender_weightage():
    try:
        # Parse JSON data from the request
        data = request.get_json()
        lender_id = data.get('lender_id')
        weightage = data.get('weightage')

        # Validate input
        if not lender_id or not isinstance(weightage, list) or len(weightage) != 8:
            return jsonify({"error": "Invalid input data"}), 400

        # Define the file path
        lender_path = os.path.join(base_dir, "lender_weights.csv")

        # Load the CSV into a DataFrame
        if os.path.exists(lender_path):
            lender_data = pd.read_csv(lender_path)
        else:
            # Create a new DataFrame if the file does not exist
            columns = ["Lender_ID", "Bank Account Insights","Transactional Behavior","Loan Repayment Records","Cash Flow Stability","Debt Obligations","Credit Utilization","Demographics and Employment","Behavioral Loan Insights"]
            lender_data = pd.DataFrame(columns=columns)

        # Check if the lender already exists
        if lender_id in lender_data["Lender_ID"].values:
            # Update the existing lender's weightage
            lender_data.loc[lender_data["Lender_ID"] == lender_id, 
                            ["Bank Account Insights","Transactional Behavior","Loan Repayment Records","Cash Flow Stability", "Debt Obligations","Credit Utilization","Demographics and Employment","Behavioral Loan Insights"]] = weightage
            action = "updated"
        else:
            # Add a new lender
            new_row = [lender_id] + weightage
            lender_data.loc[len(lender_data)] = new_row
            action = "added"

        # Save the updated DataFrame back to the CSV file
        lender_data.to_csv(lender_path, index=False)

        return jsonify({"message": f"Lender {action} successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

