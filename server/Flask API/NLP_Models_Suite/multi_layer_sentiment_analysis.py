import spacy
from textblob import TextBlob
import re

# Load spaCy's English NLP model
nlp = spacy.load("en_core_web_sm")

# Expanded custom sentiment lexicon
sentiment_lexicon = {
    "excellent": 0.9, "amazing": 0.95, "great": 0.8, "good": 0.7, "nice": 0.6, "okay": 0.5,
    "bad": -0.7, "terrible": -0.9, "awful": -1.0, "horrible": -1.0, "disgusting": -0.8,
    "love": 0.9, "hate": -1.0, "wonderful": 0.85, "fantastic": 0.9, "perfect": 1.0,
    "mediocre": -0.3, "boring": -0.5, "slow": -0.6, "fast": 0.6, "efficient": 0.7,
    "useless": -1.0, "helpful": 0.8, "waste": -0.9, "cheap": -0.5, "expensive": -0.4,
    "worthless": -1.0, "valuable": 0.9, "reliable": 0.8, "unreliable": -0.9
}

# Sarcasm detection patterns
sarcasm_patterns = [
    r"oh (?:great|amazing|wonderful|fantastic)!",  # e.g., "Oh great!"
    r"yeah, right",  # e.g., "Yeah, right..."
    r"sure, because that makes sense",  # e.g., "Sure, because that makes sense..."
    r"just what i needed",  # e.g., "Just what I needed!"
]

# Function to detect sarcasm
def detect_sarcasm(text):
    for pattern in sarcasm_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False

# Function to compute sentiment score using custom lexicon
def lexicon_sentiment_score(text):
    words = text.lower().split()
    score = sum(sentiment_lexicon.get(word, 0) for word in words) / (len(words) or 1)
    return round(score, 2)

# Advanced sentiment analysis function with multiple NLP techniques
def advanced_sentiment_analysis(text):
    doc = nlp(text)
    
    # TextBlob sentiment score
    text_blob_score = TextBlob(text).sentiment.polarity
    
    # Custom lexicon-based sentiment score
    lexicon_score = lexicon_sentiment_score(text)

    # Detect sarcasm
    sarcasm_detected = detect_sarcasm(text)
    if sarcasm_detected:
        text_blob_score *= -1
        lexicon_score *= -1

    # Negation handling using dependency parsing
    negation_words = {"not", "n't", "never", "no"}
    for token in doc:
        if token.text.lower() in negation_words:
            for child in token.children:
                if child.dep_ in {"acomp", "amod", "advmod"}:  # Adjective modifiers
                    lexicon_score *= -1
                    text_blob_score *= -1

    # Weighted sentiment adjustment using adjectives and adverbs
    weighted_score = 0
    count = 0
    for token in doc:
        if token.pos_ in {"ADJ", "ADV"}:  # Adjectives and adverbs
            weight = 1.5 if token.pos_ == "ADJ" else 1.2  # Give more weight to adjectives
            weighted_score += sentiment_lexicon.get(token.text.lower(), 0) * weight
            count += 1

    # Normalize weighted sentiment
    weighted_score = (weighted_score / count) if count else 0

    # Final score: Combining all methods
    final_score = (text_blob_score + lexicon_score + weighted_score) / 3

    return {
        "text": text,
        "text_blob_score": round(text_blob_score, 2),
        "lexicon_score": round(lexicon_score, 2),
        "weighted_score": round(weighted_score, 2),
        "sarcasm_detected": sarcasm_detected,
        "final_score": round(final_score, 2)
    }

# Test cases
test_sentences = [
    "This is absolutely amazing!",
    "I hate this product, it is horrible!",
    "Not bad at all!",
    "The food was okay, but the service was terrible!",
    "I don't know if I like this or not.",
    "Oh great, another bug! Just what I needed!",
    "Yeah, right, as if this will ever work properly.",
    "This is perfect! Couldn't be better!",
    "The performance is fantastic, but the battery life is disappointing.",
    "I never thought I would say this, but this is actually good."
]

# Run sentiment analysis on test cases
for sentence in test_sentences:
    print(advanced_sentiment_analysis(sentence))
