import React from "react";
import '../styles/bodyTemp.css';

const BodyTemp = () => {
  return (
    <div className="body-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Revolutionizing Email Analysis with AI</h1>
        <p>Automate sentiment analysis, extract insights, and streamline email processing in real time.</p>
        <div className="hero-buttons">
          <button className="btn primary">Get Started</button>
          <button className="btn secondary">Learn More</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why SentiMail?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>AI-Powered Sentiment Analysis</h3>
            <p>Detects emotions and classifies emails as Positive, Neutral, or Negative.</p>
          </div>
          <div className="feature-card">
            <h3>Automated Data Extraction</h3>
            <p>Pulls key details from emails and organizes them into structured reports.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Categorization</h3>
            <p>Sorts emails into predefined folders based on content analysis.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Insights & Dashboards</h3>
            <p>Provides graphical analytics to track sentiment trends.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Fetch & Analyze Emails</h3>
            <p>Connects to your email inbox and retrieves messages securely.</p>
          </div>
          <div className="step">
            <h3>2. Extract Key Insights</h3>
            <p>Uses NLP and AI to analyze sentiment, extract data, and summarize content.</p>
          </div>
          <div className="step">
            <h3>3. Deliver Reports & Take Action</h3>
            <p>Outputs results as structured reports and suggests automated responses.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Automate Your Email Analysis?</h2>
        <button className="btn primary">Get Started Now</button>
      </section>
    </div>
  );
};

export default BodyTemp;
