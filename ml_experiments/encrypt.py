import os
import cv2
import pandas as pd
from skimage.morphology import skeletonize, thin
from skimage import io, img_as_bool, img_as_ubyte
import numpy as np
import ppxgboost.PPQuery as PPQuery
import pickle
import pyope.ope as pyope
import ppxgboost.OPEMetadata as OPEMetadata
import ppxgboost.PPKey as PPKey
from ppxgboost import PPPrediction as prediction
import ppxgboost.PPModel as PPModel


# read a single input image and create feature vector
def read_image(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    # plt.imshow(img)
    img = cv2.resize(img, (160, 160))
    if img is not None:
        skeleton_image = preprocess_image(img)
        minutiae_feature = extract_minutiae(skeleton_image)
        feature_vector = create_feature_vector(minutiae_feature, img.shape)
    return img, feature_vector


def preprocess_image(image):
    # Apply Gaussian blur to reduce noise
    image = cv2.GaussianBlur(image, (3, 3), 0)

    # Binarize the image using Otsu's threshold
    _, binary_image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    skeleton = skeletonize(binary_image // 255)
    skeleton = img_as_ubyte(skeleton)

    return skeleton


def extract_minutiae(skeleton):
    kernel = np.uint8([[0, 0, 0], [1, 1, 0], [0, 1, 0]])
    minutiae = cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, kernel)

    # Convert minutiae points to coordinates
    minutiae_locations = np.column_stack(np.where(minutiae > 0))

    return minutiae_locations


def create_feature_vector(minutiae_points, image_shape, grid_size=(8, 8)):
    feature_vector = np.zeros(grid_size[0] * grid_size[1])

    # Calculate cell size
    cell_height = image_shape[0] // grid_size[0]
    cell_width = image_shape[1] // grid_size[1]

    for minutia in minutiae_points:
        # Determine the grid cell for this minutia
        row = minutia[0] // cell_height
        col = minutia[1] // cell_width

        # Calculate the index in the feature vector
        index = row * grid_size[1] + col
        feature_vector[index] += 1

    return feature_vector


def create_grid(row, col):
    grid = []
    for i in range(row):
        for j in range(col):
            grid.append("(" + str(i) + "," + str(j) + ")")
    return grid


def encrypt(feature):
    # convert feature vector to pd dataframe
    grid = create_grid(8, 8)
    feature = pd.DataFrame(feature.reshape(1, 64))
    feature.columns = grid
    # Encrypts the input vector for prediction (using prf_key_hash and ope-encrypter) based on the feature set
    queries = PPQuery.pandas_to_queries(feature)
    # add fake data
    with open('ppModel.pkl', 'rb') as file:
        ppModel = pickle.load(file)
        
    # Set up encryption materials.
    with open('queryEncryptor.pkl', 'rb') as file:
        queryEncryptor = pickle.load(file)
    enc_queries = PPQuery.encrypt_queries(queryEncryptor, queries)
    return enc_queries, queryEncryptor.key

# predict encrypted feature
def predict(num_classes, enc_queries):
    # load the encrypted model
    with open('encModel.pkl', 'rb') as file:
        enc_model = pickle.load(file)
    return prediction.predict_multiclass(enc_model, num_classes, enc_queries)

def decrypt(pred, querykey):
    return prediction.client_decrypt_prediction_multiclass(querykey.get_private_key(), pred)



if __name__ == '__main__':
    # path for img
    folder = "../data/dataset_FVC2000_DB4_B/dataset/real_data/"
    img_path = "00000.bmp"
    _, feature = read_image(os.path.join(folder, img_path))

    # encrypt feature
    print("Encrypted feature:", vars(encrypt(feature)[0][0]))

    # predict model
    enc_predictions = predict(num_classes = 10, enc_queries = encrypt(feature)[0])
    # print(enc_predictions)

    print(decrypt(enc_predictions, encrypt(feature)[1]))



