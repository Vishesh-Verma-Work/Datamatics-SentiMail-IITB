import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section footer__about">
          <h4>About Us</h4>
          <p>
            MERN App is your go-to platform for seamless CRUD operations with a modern design and intuitive experience.
          </p>
        </div>
        <div className="footer__section footer__links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/create">Create</a></li>
            <li><a href="/all">Show All</a></li>
          </ul>
        </div>
        <div className="footer__section footer__social">
          <h4>Follow Us</h4>
          <div className="footer__icons">
            <a href="#" aria-label="Facebook" className="footer__icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter" className="footer__icon"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram" className="footer__icon"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} MERN App. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
