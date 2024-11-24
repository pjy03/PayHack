# import pandas as pd
# import random

# # Define ranges and categories
# def generate_random_dataset(num_samples=100):
#     # Expanded list of microloan purposes
#     loan_purposes = [
#         "Startup Capital", "Working Capital", "Equipment Purchase", 
#         "Inventory Purchase", "Marketing and Advertising", "Technology Upgrade", 
#         "Business Expansion", "Training and Development", "Vehicle for Business Use",
#         "Emergency Business Funds", "Education Fees", "Healthcare Expenses",
#         "Home Renovation", "Utility Payments", "Agriculture Expenses",
#         "Wedding Expenses", "Travel Costs", "Debt Consolidation", 
#         "Childcare Expenses", "Emergency Personal Funds", 
#         "Community Projects", "Social Enterprise", "Green Initiatives"
#     ]

#     # Logical limits for loan terms based on purpose
#     microloan_purposes = [
#         "Startup Capital", "Working Capital", "Equipment Purchase", 
#         "Inventory Purchase", "Marketing and Advertising", "Technology Upgrade", 
#         "Training and Development", "Emergency Business Funds", "Utility Payments", 
#         "Community Projects", "Social Enterprise", "Green Initiatives"
#     ]

#     def get_loan_term(purpose):
#         if purpose in microloan_purposes:
#             return random.choice([12, 24, 36])  # Shorter terms for microloans
#         else:
#             return random.choice([48, 60, 72])  # Longer terms for non-microloans

#     # Function to generate random values
#     def random_credit_score():
#         return random.randint(600, 850)  # Typical credit score range

#     def random_applied_loan_amount():
#         # Loan amounts ending with 000
#         return random.choice(range(5000, 100001, 1000))

#     def random_purpose():
#         return random.choice(loan_purposes)

#     def random_interest_rate(credit_score):
#         # Lower interest rates for higher credit scores with trailing 0 or 5
#         if credit_score >= 750:
#             return round(random.uniform(2.5, 4.0), 2)
#         elif credit_score >= 700:
#             return round(random.uniform(4.0, 5.5), 2)
#         elif credit_score >= 650:
#             return round(random.uniform(5.5, 7.0), 2)
#         else:
#             return round(random.uniform(7.0, 9.0), 2)

#     def adjust_rate(rate):
#         # Adjust rate to have trailing 0 or 5
#         rate_str = f"{rate:.2f}"
#         if rate_str[-1] in {'0', '5'}:
#             return rate
#         return round(rate - (float(rate_str[-1]) % 0.05), 2)

#     def random_loan_amount(applied_amount):
#         # Loan offers are slightly less than or equal to the applied amount, ending with 000
#         proposed = random.randint(int(applied_amount * 0.8), applied_amount)
#         return proposed - (proposed % 1000)

#     # Generate dataset
#     data = {
#         "CreditScore": [],
#         "AppliedLoanAmount": [],
#         "Purpose": [],
#         "ProposedInterestRate": [],
#         "ProposedLoanAmount": [],
#         "ProposedLoanTerm": []
#     }
    
#     for _ in range(num_samples):
#         credit_score = random_credit_score()
#         applied_amount = random_applied_loan_amount()
#         purpose = random_purpose()
#         interest_rate = adjust_rate(random_interest_rate(credit_score))
#         loan_amount = random_loan_amount(applied_amount)
#         loan_term = get_loan_term(purpose)
        
#         # Append to data dictionary
#         data["CreditScore"].append(credit_score)
#         data["AppliedLoanAmount"].append(applied_amount)
#         data["Purpose"].append(purpose)
#         data["ProposedInterestRate"].append(interest_rate)
#         data["ProposedLoanAmount"].append(loan_amount)
#         data["ProposedLoanTerm"].append(loan_term)
    
#     # Convert to DataFrame
#     return pd.DataFrame(data)

# # Generate 3000 random samples
# random_dataset = generate_random_dataset(6000)

# # Save to CSV
# random_dataset.to_csv("generated_loan_data.csv", index=False)
# print("Random dataset saved as 'generated_loan_data.csv'")

# # Display first few rows
# print(random_dataset.head())


import pandas as pd

# Assuming your dataframe is named df
df = pd.read_csv('InterestModel/loan_data.csv')  # Load the data (adjust if needed)

# Set loan_int_rate to 0 where loan_status is 0
df.loc[df['loan_status'] == 0, 'loan_int_rate'] = 0

import random

# Define loan term ranges for each loan intent
loan_term_ranges = {
    'PERSONAL': (12, 60),
    'EDUCATION': (36, 120),
    'MEDICAL': (12, 48),
    'VENTURE': (24, 60),
    'HOMEIMPROVEMENT': (24, 60),
    'DEBTCONSOLIDATION': (12, 60)
}

# Function to assign loan term based on loan intent
def assign_loan_term(intent):
    min_term, max_term = loan_term_ranges.get(intent, (12, 60))  # Default to 12-60 months if intent not found
    return random.randint(min_term, max_term)

# Apply the function to create the loan_term column
df['loan_term'] = df['loan_intent'].apply(assign_loan_term)

# Print the updated dataframe
df.drop(columns="loan_status", axis = 1,inplace=True)
print(df)

df.to_csv("loan_data.csv")
