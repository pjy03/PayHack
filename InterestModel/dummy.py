import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from joblib import dump
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
data = pd.read_csv("application_train_merge.csv")  # Replace with the actual dataset file path

# Feature groups mapping
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

# Target column
target_column = "TARGET"  # Replace with the actual target column in your dataset
# Apply label encoding
label_encoder = LabelEncoder()
data['NAME_CONTRACT_TYPE'] = label_encoder.fit_transform(data['NAME_CONTRACT_TYPE'])

# Save the encoder for consistent transformations during prediction
joblib.dump(label_encoder, 'name_contract_type_encoder.pkl')
# Train models for each feature group
for group_name, features in feature_groups.items():
    print(f"Training model for: {group_name}")
    
    # Filter dataset for the current feature group
    X = data[features]
    y = data[target_column]
    
    # Handle missing values (if any)
    X.fillna(X.mean(), inplace=True)
    
    # Encode categorical variables (if any)
    X = pd.get_dummies(X)
    
    # Split into train-test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a Random Forest Classifier
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy for {group_name}: {accuracy:.2f}")
    
    # Save the model
    model_filename = f"model_{group_name.replace(' ', '_').replace('-', '_')}.joblib"
    dump(model, model_filename)
    print(f"Model saved as {model_filename}\n")

# import csv
# import numpy as np

# # Define the data structure
# lenders = [
#     {"Lender_ID": "Lender A", "Bank Account Insights": 0.55, "Transactional Behavior": 0.65,
#      "Loan Repayment Records": 0.3, "Cash Flow Stability": 0.22, "Debt Obligations": 0.66,
#      "Credit Utilization": 0.28, "Demographics and Employment": 0.03},
    
#     {"Lender_ID": "Lender B", "Bank Account Insights": 0.79, "Transactional Behavior": 0.45,
#      "Loan Repayment Records": 1.0, "Cash Flow Stability": 0.49, "Debt Obligations": 0.59,
#      "Credit Utilization": 0.14, "Demographics and Employment": 0.69},
    
#     {"Lender_ID": "Lender C", "Bank Account Insights": 0.78, "Transactional Behavior": 0.86,
#      "Loan Repayment Records": 0.68, "Cash Flow Stability": 0.74, "Debt Obligations": 0.69,
#      "Credit Utilization": 0.02, "Demographics and Employment": 0.84},
    
#     {"Lender_ID": "Lender D", "Bank Account Insights": 0.47, "Transactional Behavior": 0.46,
#      "Loan Repayment Records": 0.53, "Cash Flow Stability": 0.67, "Debt Obligations": 0.09,
#      "Credit Utilization": 0.98, "Demographics and Employment": 0.97},
    
#     {"Lender_ID": "Lender E", "Bank Account Insights": 0.68, "Transactional Behavior": 0.96,
#      "Loan Repayment Records": 0.49, "Cash Flow Stability": 0.78, "Debt Obligations": 0.42,
#      "Credit Utilization": 0.72, "Demographics and Employment": 0.36}
# ]

# # Normalize values for each lender
# for lender in lenders:
#     total = sum(value for key, value in lender.items() if key != "Lender_ID")
#     for key in lender:
#         if key != "Lender_ID":
#             lender[key] = round(lender[key] / total, 2)  # Normalize and round to 2 decimals

# # Write to CSV file
# output_file = "lender_weights.csv"
# header = [
#     "Lender_ID", "Bank Account Insights", "Transactional Behavior",
#     "Loan Repayment Records", "Cash Flow Stability", "Debt Obligations",
#     "Credit Utilization", "Demographics and Employment"
# ]

# with open(output_file, mode="w", newline="") as file:
#     writer = csv.DictWriter(file, fieldnames=header)
#     writer.writeheader()
#     writer.writerows(lenders)

# print(f"CSV file '{output_file}' has been created successfully.")
