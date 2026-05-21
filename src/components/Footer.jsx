import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Users, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer section glass-panel" style={{ borderRadius: '2rem 2rem 0 0', marginTop: '4rem', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="logo mb-4">
              <span className="logo-icon">🏢</span>
              <span className="logo-text">Aura<span className="text-gradient">Estates</span></span>
            </Link>
            <p className="text-secondary mb-4">
              We provide the best real estate options for you. Whether you want to buy, sell, or rent, we are here to help you find your dream property.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Globe size={20} /></a>
              <a href="#" className="social-icon"><MessageCircle size={20} /></a>
              <a href="#" className="social-icon"><Share2 size={20} /></a>
              <a href="#" className="social-icon"><Users size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/agents">Agents</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Categories</h3>
            <ul>
              <li><Link to="/properties?type=flats">Flats & Apartments</Link></li>
              <li><Link to="/properties?type=houses">Houses & Villas</Link></li>
              <li><Link to="/properties?type=plots">Plots & Land</Link></li>
              <li><Link to="/properties?type=pg">PG & Co-living</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info">
              <li><MapPin size={18} className="text-accent-blue" /> 123 Real Estate Avenue, NY 10001</li>
              <li><Phone size={18} className="text-accent-blue" /> +1 (555) 123-4567</li>
              <li><Mail size={18} className="text-accent-blue" /> contact@auraestates.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aura Estates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
