import React from "react";
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">

      {/* About Section */}
      <section className="about" id="about">
        <h2>About Us</h2>
        <p>
          We are a data-driven organization specializing in advanced analytics,
          AI-powered tools, and intuitive dashboards to bring your business to the next level. 
          Our team combines expertise in data engineering and visualization to offer bespoke 
          solutions for your unique challenges.
        </p>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <h3>Data Visualization</h3>
            <p>
              Create interactive, visually engaging dashboards and reports 
              to make data understandable at a glance.
            </p>
          </div>
          <div className="service-card">
            <h3>Predictive Analytics</h3>
            <p>
              Leverage AI and machine learning models to predict future trends 
              and optimize your strategy.
            </p>
          </div>
          <div className="service-card">
            <h3>Data Cleansing</h3>
            <p>
              Ensure your data is accurate, consistent, and ready for impactful analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>AI-Driven Insights</h3>
            <p>Harness the power of artificial intelligence for deeper insights.</p>
          </div>
          <div className="feature-item">
            <h3>User-Friendly Dashboards</h3>
            <p>Seamlessly interact with data through intuitive designs.</p>
          </div>
          <div className="feature-item">
            <h3>Real-Time Data</h3>
            <p>Stay up-to-date with real-time analytics and decision-making tools.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Transform Your Data?</h2>
        <p>Contact us today and start your journey toward smarter analytics.</p>
        <a href="#contact" className="cta-button">
          Get Started
        </a>
      </section>

   
    </div>
  );
};

export default Home;
