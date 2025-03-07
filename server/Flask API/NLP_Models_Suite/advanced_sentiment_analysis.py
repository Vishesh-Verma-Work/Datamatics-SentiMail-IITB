import fasttext
import random
import time
import string
import os
from sklearn.metrics import accuracy_score

# Expanded vocabulary for more realistic training data
POSITIVE_WORDS = ["good", "excellent", "fantastic", "amazing", "wonderful", "superb", "great", "love", "awesome"]
NEGATIVE_WORDS = ["bad", "terrible", "awful", "horrible", "poor", "worst", "disgusting", "hate", "useless"]
NEUTRAL_WORDS = ["okay", "average", "mediocre", "fine", "not bad", "decent", "fair"]
ALL_WORDS = POSITIVE_WORDS + NEGATIVE_WORDS + NEUTRAL_WORDS

TRAIN_FILE = "train_data.txt"
MODEL_FILE = "sentiment_model.bin"

# Function to generate synthetic training data
def create_training_data(file_path=TRAIN_FILE, num_samples=5000):
    categories = ["__label__positive", "__label__negative", "__label__neutral"]
    with open(file_path, "w") as f:
        for _ in range(num_samples):
            label = random.choice(categories)
            if "positive" in label:
                words = random.choices(POSITIVE_WORDS, k=random.randint(5, 15))
            elif "negative" in label:
                words = random.choices(NEGATIVE_WORDS, k=random.randint(5, 15))
            else:
                words = random.choices(NEUTRAL_WORDS, k=random.randint(5, 15))
            sentence = " ".join(words)
            f.write(f"{label} {sentence}\n")

# Function to train the FastText model
def train_fasttext_model(train_file=TRAIN_FILE, model_path=MODEL_FILE):
    if not os.path.exists(train_file):
        print("Training data not found. Generating...")
        create_training_data()
    model = fasttext.train_supervised(train_file)
    model.save_model(model_path)
    print("Model training complete.")
    return model

# Function to classify a single text input
def classify_text(model, text):
    return model.predict(text)

# Generate test sentences
def generate_sentences(num=50):
    return [" ".join(random.choices(ALL_WORDS, k=random.randint(5, 15))) for _ in range(num)]

# Perform batch classification with timing
def batch_classification(model, num_sentences=50):
    sentences = generate_sentences(num_sentences)
    results = []
    start_time = time.time()
    for sentence in sentences:
        classification = classify_text(model, sentence)
        results.append((sentence, classification))
        time.sleep(0.05)  # Simulating delay
    end_time = time.time()
    print(f"Classified {num_sentences} sentences in {round(end_time - start_time, 2)} seconds.")
    return results

# Evaluate model accuracy
def evaluate_model(model, num_samples=100):
    true_labels = []
    predicted_labels = []
    test_sentences = generate_sentences(num_samples)
    for sentence in test_sentences:
        true_label = "positive" if any(w in POSITIVE_WORDS for w in sentence.split()) else \
                     "negative" if any(w in NEGATIVE_WORDS for w in sentence.split()) else "neutral"
        predicted_label = classify_text(model, sentence)[0][0].replace("__label__", "")
        true_labels.append(true_label)
        predicted_labels.append(predicted_label)
    accuracy = accuracy_score(true_labels, predicted_labels)
    print(f"Model Accuracy: {round(accuracy * 100, 2)}%")

if __name__ == "__main__":
    print("Generating training data...")
    create_training_data()
    print("Training FastText model...")
    model = train_fasttext_model()
    print("Starting batch classification...")
    batch_results = batch_classification(model, 100)
    print("Evaluating model...")
    evaluate_model(model)