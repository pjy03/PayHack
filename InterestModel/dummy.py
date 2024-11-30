import pickle

# Load the model
with open('C:\\Users\\Pu Jun Yu\\Desktop\\PayHack\\PayHack2024\\client\\app\\pages\\api\\svm_chain_model.pkl', 'rb') as file:
    model = pickle.load(file)

# Check for feature names (scikit-learn example)
if hasattr(model, 'feature_names_in_'):
    print("Feature names:", model.feature_names_in_)
else:
    print("The model does not have feature names stored.")
