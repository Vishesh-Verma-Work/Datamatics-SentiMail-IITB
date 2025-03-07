import spacy
import time

nlp = spacy.load("en_core_web_sm")

def named_entity_recognition_spacy(text):
    """
    Extracts named entities from the text using Spacy
    """
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return entities

def generate_entity_text():
    """
    Generates sample texts containing named entities
    """
    return [
        "Google was founded by Larry Page and Sergey Brin in California.",
        "Elon Musk owns Tesla and SpaceX.",
        "Apple Inc. is headquartered in Cupertino, California.",
        "Jeff Bezos founded Amazon, the largest e-commerce platform.",
    ]

# Process texts
texts = generate_entity_text() * 100  # Expanding to 400+ examples

for i, text in enumerate(texts):
    print(f"Processing Text {i+1}: {text}")
    print("Entities:", named_entity_recognition_spacy(text))
    print("-" * 50)
    time.sleep(0.05)

print("NER Processing Completed!")
