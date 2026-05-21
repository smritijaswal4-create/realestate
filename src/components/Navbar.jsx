import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, Users, Menu, X, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/properties', label: 'Properties', icon: <Building2 size={18} /> },
    { path: '/agents', label: 'Agents', icon: <Users size={18} /> },
  ];

  return (
    <motion.header 
      className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">Aura<span className="text-gradient">Estates</span></span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active glass-panel' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          {user && (
            <Link 
              to="/dashboard" 
              className={`nav-link mobile-only ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users size={18} />
              <span>Dashboard</span>
            </Link>
          )}
          <div className="nav-auth-mobile">
            {user ? (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="btn btn-outline w-full"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>

        <div className="nav-auth-desktop">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" style={{ marginRight: '15px' }}>Dashboard</Link>
              <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link"><LogIn size={18} /> Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;
