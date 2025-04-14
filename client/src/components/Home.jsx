import React from 'react';
import '../styles/home.css';
import img from '../utils/wrkflw.png';
const Home = () => {
  return (
    <div className='home-container'>

      {/* Landing Section */}
      <section className='home-landing-section'>
        <div className='home-overlay'></div>
        <div className='home-landing-content'>
          <h1 className='home-animated-heading'>Welcome to <span className='home-brand-name'>Sentimail</span></h1>
          <p className='home-tagline'>Where AI meets Feedback, and Insights Spark Innovation.</p>
          <p className='home-description'>
            Sentimail is your all-in-one AI-powered solution for feedback analysis, turning emails and reviews into structured insights.
            Whether you're a business owner, educational institute, or product team, Sentimail lets you decode emotions,
            prioritize responses, and visualize trends — instantly.
          </p>
          <a href='#about' className='home-cta-button'>Explore More</a>
        </div>
      </section>

      {/* About Section */}
      <section className='home-about' id='about'>
        <h2>About Sentimail</h2>
        <p>
          In today's digital age, feedback is scattered across multiple platforms. Sentimail acts as a central hub, collecting feedback via emails,
          reviews, and forms, analyzing sentiments with AI, and organizing them with visual dashboards. Say goodbye to manual analysis and hello
          to automation, accuracy, and speed. Designed for startups, enterprises, and educators, Sentimail adapts to your needs.
        </p>
        <p>
          Our smart categorization engine tags feedback into complaints, praises, suggestions, and questions. Through real-time dashboards,
          heatmaps, and sentiment graphs, we help you visualize what matters most. With customizable workflows, priority scores, and
          multilingual analysis, Sentimail puts feedback at the heart of your decision-making.
        </p>
      </section>

      {/* Features Section */}
      <section className='home-features'>
        <h2>Key Features</h2>
        <div className='home-feature-grid'>
          <div className='home-feature-box'>
            <h3>Real-Time Sentiment Analysis</h3>
            <p>Instantly analyze tone and emotion in customer or employee emails using advanced AI models.</p>
          </div>
          <div className='home-feature-box'>
            <h3>Smart Categorization</h3>
            <p>Automatically classify feedback as complaints, queries, suggestions, or compliments.</p>
          </div>
          <div className='home-feature-box'>
            <h3>Multilingual Support</h3>
            <p>Break the language barrier — analyze feedback in over 30 global languages.</p>
          </div>
          <div className='home-feature-box'>
            <h3>Dashboards & Visuals</h3>
            <p>Interactive, intuitive dashboards turn raw data into actionable visual insights.</p>
          </div>
          <div className='home-feature-box'>
            <h3>Automation Ready</h3>
            <p>Automatically route critical issues to the right teams — faster responses, better outcomes.</p>
          </div>
          <div className='home-feature-box'>
            <h3>Privacy First</h3>
            <p>Sentimail ensures complete confidentiality with secure email integrations and encryption.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='home-how-it-works'>
        <h2>How Sentimail Works</h2>
        <div className='home-workflow'>
          <div className='home-workflow-step'>
            <span>1</span>
            <h4>Connect</h4>
            <p>Integrate your Gmail, Outlook, or support inbox securely with Sentimail.</p>
          </div>
          <div className='home-workflow-step'>
            <span>2</span>
            <h4>Analyze</h4>
            <p>Let our AI model extract sentiment, category, keywords, and urgency in seconds.</p>
          </div>
          <div className='home-workflow-step'>
            <span>3</span>
            <h4>Visualize</h4>
            <p>View trends, heatmaps, priority matrices, and more through modern dashboards.</p>
          </div>
          <div className='home-workflow-step'>
            <span>4</span>
            <h4>Act</h4>
            <p>Assign tasks, notify departments, or reply directly — all from Sentimail’s panel.</p>
          </div>
        </div>
        <div className="h-img">
        <img src={img} alt="fgdg" />
        </div>
      </section>

      {/* Call to Action */}
      <section className='home-cta'>
        <h2>Start Your Feedback Revolution</h2>
        <p>Get started with Sentimail today and experience the transformation in how you listen, learn, and lead.</p>
        <a href='#contact' className='home-cta-button'>Request a Demo</a>
      </section>
    </div>
  );
};

export default Home;