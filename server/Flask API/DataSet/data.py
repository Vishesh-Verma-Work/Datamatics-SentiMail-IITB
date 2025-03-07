from flask import Flask, jsonify, request

app = Flask(__name__)

# Expanded Extreme Sentiment Test Cases
dataset = {
    "positive": [
        "Absolutely amazing! Best experience ever!", "I love this product, it's fantastic!", 
        "Such a wonderful day, everything is perfect!", "This is the best decision I've ever made!", 
        "Truly a masterpiece, exceeded all my expectations!", "Everything is flawless, pure perfection!",
        "Couldn't be happier with this purchase!", "Brilliant idea! This changes everything!", 
        "Five stars! Highly recommend to everyone!", "Such an innovative and outstanding product!",
        "Life-changing experience, I am beyond impressed!", "Every detail is well thought out, superb!", 
        "Pure joy! Worth every penny!", "Amazing support team, always helpful and friendly!", 
        "This exceeded my expectations in every way!", "Absolutely breathtaking, a must-have!", 
        "Incredible performance, smooth and efficient!", "I feel lucky to have found this!", 
        "Wonderful, magnificent, and absolutely delightful!", "Never seen anything better, hands down!"
    ],
    "negative": [
        "This is the worst experience of my life!", "I hate everything about this, it's awful!", 
        "Total disaster, nothing went right.", "Completely useless, waste of money!", 
        "I regret ever buying this, absolute disappointment!", "Horrible, do not recommend at all!", 
        "Terrible customer service, completely unhelpful!", "This is an embarrassment of a product!", 
        "Broke after a day, completely unreliable!", "Nothing but frustration, worst decision ever!", 
        "Beyond terrible, avoid at all costs!", "Unbelievably bad, shocked at the poor quality!", 
        "What a scam! This should be illegal!", "Worst investment of my life, never again!", 
        "Ruined everything, absolute nightmare!", "Defective, cheap, and poorly designed!", 
        "This company should be ashamed, shocking experience!", "Garbage product, doesn't work at all!", 
        "Pathetic excuse for a service, never coming back!", "I can't believe how bad this is!"
    ],
    "mixed": [
        "The food was great but the service was terrible.", "I love the design, but it's not functional.", 
        "Not bad, but not great either.", "Quality is decent, but the price is too high.", 
        "Great features, but buggy and unreliable.", "Nice idea, but the execution is flawed.", 
        "Loved the customer support, but the product failed me.", "Good potential, but needs improvements.", 
        "Affordable, but lacks durability.", "Smooth interface, but slow performance.", 
        "Some aspects are good, others are frustrating.", "Works well, but not user-friendly.", 
        "A solid attempt, but needs more polish.", "Fine for casual use, but not professional quality.", 
        "The pros outweigh the cons, but barely.", "Satisfactory, but missing a few key features.", 
        "It's okay, but wouldn't buy it again.", "Nice packaging, but the contents were disappointing.", 
        "Reliable, but outdated.", "Useful, but lacks key functionalities."
    ],
    "sarcasm": [
        "Oh great, another delay. Just what I needed!", "Wow, this is exactly how I imagined wasting my time.", 
        "Fantastic! Another bug! Loving it.", "Oh sure, because everything else was working perfectly!", 
        "Just brilliant! Yet another failure to add to the list!", "Oh yes, I totally enjoy waiting for hours!", 
        "Oh wow, what a groundbreaking discovery… not.", "Amazing! Another broken feature!", 
        "Because obviously, my day wasn’t bad enough already.", "Yes, I definitely love redoing everything!", 
        "Oh sure, customer service is so ‘helpful’ as always.", "Yay! More problems to solve! Just what I wanted!", 
        "Oh wow, slowest service ever. Amazing!", "Oh, this works great! If great means completely unusable!", 
        "Wow, such efficiency! Only took a decade!", "Fantastic! Another misleading advertisement!", 
        "Oh, I love how my issue is ‘escalated’ and then ignored!", "Great job! If failure was the goal!", 
        "Oh yes, please take even longer. I have all day!", "Just what I needed, another broken promise!"
    ]
}

@app.route("/test_data", methods=["GET"])
def get_test_data():
    category = request.args.get("category", "all")
    if category in dataset:
        return jsonify({"category": category, "data": dataset[category]})
    return jsonify(dataset)  # Return all data if no category specified

if __name__ == "__main__":
    app.run(debug=True)
