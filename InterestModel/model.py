import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
from sklearn.multioutput import RegressorChain, MultiOutputRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
import joblib

# 1. Load Dataset from CSV
file_path = "loan_data.csv"  # Ensure the file path is correct
df = pd.read_csv(file_path)

# 2. Data Preprocessing
# Encode categorical data (Purpose)
df['loan_intent'] = pd.factorize(df['loan_intent'])[0]
print(df)
# Split data into features (X) and targets (y)
X = df[["credit_score", "loan_amnt", "loan_intent","loan_term"]]
y = df[["loan_int_rate"]]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Define and Train the Models
# 3.1. RegressorChain with SVR
svm_chain = RegressorChain(SVR(kernel="rbf", C=100, gamma=0.1, epsilon=0.1))
svm_chain.fit(X_train, y_train)

# # 3.2. MultiOutputRegressor with SVR
# svm_multi = MultiOutputRegressor(SVR(kernel="rbf", C=100, gamma=0.1, epsilon=0.1))
# svm_multi.fit(X_train, y_train)

# # 3.3. KNeighborsRegressor
# knn = KNeighborsRegressor()
# knn.fit(X_train, y_train)

# # 3.4. LinearRegression
# linear = LinearRegression()
# linear.fit(X_train, y_train)

# # 3.5. RandomForestRegressor
# rdf = RandomForestRegressor()
# rdf.fit(X_train, y_train)

# # 3.6. ExtraTreesRegressor
# extra_reg = ExtraTreesRegressor()
# extra_reg.fit(X_train, y_train)


joblib.dump(svm_chain, "svm_chain_model.pkl")
print("RegressorChain model saved as 'svm_chain_model.pkl'")

# 4. Evaluation and Results Display Function
def printPredictions(y_true, y_pred, count):
    print(f"Predictions: ")
    print(y_true.assign(
        Y1_pred=y_pred[:, 0],
        Y2_pred=y_pred[:, 1]
    ).head(count).to_markdown(index=False))

def showResults(y_true, y_pred, count=5):
    print("R2 score: ", r2_score(y_true, y_pred))
    print("Mean squared error: ", mean_squared_error(y_true, y_pred))
    print("Mean absolute error: ", mean_absolute_error(y_true, y_pred))
    printPredictions(y_true, y_pred, count)

# 5. Show Results and Save Models
# 5.1. RegressorChain with SVR
print("RegressorChain with SVR Results:")
y_pred = svm_chain.predict(X_test)
showResults(y_test, y_pred)
# # 5.2. MultiOutputRegressor with SVR
# print("MultiOutputRegressor with SVR Results:")
# y_pred = svm_multi.predict(X_test)
# showResults(y_test, y_pred)
# joblib.dump(svm_multi, "svm_multi_model.pkl")
# print("MultiOutputRegressor model saved as 'svm_multi_model.pkl'")

# # 5.3. KNeighborsRegressor
# print("KNeighborsRegressor Results:")
# y_pred = knn.predict(X_test)
# showResults(y_test, y_pred)
# joblib.dump(knn, "knn_model.pkl")
# print("KNeighborsRegressor model saved as 'knn_model.pkl'")

# # 5.4. LinearRegression
# print("LinearRegression Results:")
# y_pred = linear.predict(X_test)
# showResults(y_test, y_pred)
# joblib.dump(linear, "linear_model.pkl")
# print("LinearRegression model saved as 'linear_model.pkl'")

# # 5.5. RandomForestRegressor
# print("RandomForestRegressor Results:")
# y_pred = rdf.predict(X_test)
# showResults(y_test, y_pred)
# joblib.dump(rdf, "rdf_model.pkl")
# print("RandomForestRegressor model saved as 'rdf_model.pkl'")

# # 5.6. ExtraTreesRegressor
# print("ExtraTreesRegressor Results:")
# y_pred = extra_reg.predict(X_test)
# showResults(y_test, y_pred)
# joblib.dump(extra_reg, "extra_reg_model.pkl")
# print("ExtraTreesRegressor model saved as 'extra_reg_model.pkl'")

# # 6. Load and Use the Models (for verification)
# # 6.1. Load and use RegressorChain model
# loaded_model = joblib.load("svm_chain_model.pkl")
# print("Loaded RegressorChain model predictions (first 5 rows):")
# print(loaded_model.predict(X_test[:5]))

# # 6.2. Load and use MultiOutputRegressor model
# loaded_model = joblib.load("svm_multi_model.pkl")
# print("Loaded MultiOutputRegressor model predictions (first 5 rows):")
# print(loaded_model.predict(X_test[:5]))
