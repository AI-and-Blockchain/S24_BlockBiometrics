import pickle
from ppxgboost import PPPrediction as prediction

def load_model():
    with open('encModel.pkl', 'rb') as file:
        enc_model = pickle.load(file)

if __name__ == '__main__':
    load_model()
    # input enc_queries
    # prediction.predict_multiclass(enc_model, num_classes, enc_queries)
    #result = prediction.client_decrypt_prediction_multiclass(ppQueryKey.get_private_key(), enc_predictions)