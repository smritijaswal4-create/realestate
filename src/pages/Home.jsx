import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home as HomeIcon, Building, Key, Shield, Clock, Award, CheckCircle, Quote } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { API_URL } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchLoc, setSearchLoc] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch properties from database for Featured section
  useEffect(() => {
    const fetchFeatured = async () => {
      setLoadingProperties(true);
      try {
        const response = await fetch(`${API_URL}/properties`);
        const data = await response.json();
        if (data.success) {
          // Take first 3 properties as featured
          setFeaturedProperties(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchLoc) queryParams.append('search', searchLoc);
    if (propertyType) queryParams.append('type', propertyType);
    
    navigate(`/properties?${queryParams.toString()}`);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <motion.div 
          className="container hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Find Your Dream <br />
            <span className="text-gradient">Property</span> Today
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Discover the best flats, houses, plots, and PG accommodations in your desired location.
          </motion.p>

          <motion.div className="hero-search glass-panel" variants={scaleIn}>
            <div className="search-inputs">
              <div className="search-field">
                <MapPin className="text-accent-blue" size={20} />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="input-transparent"
                  value={searchLoc}
                  onChange={(e) => setSearchLoc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="search-field">
                <HomeIcon className="text-accent-blue" size={20} />
                <select 
                  className="input-transparent"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option value="flat">Flat / Apartment</option>
                  <option value="house">House / Villa</option>
                  <option value="plot">Plot / Land</option>
                  <option value="pg">PG / Co-living</option>
                </select>
              </div>
              <button className="btn btn-primary search-btn" onClick={handleSearch}>
                <Search size={20} /> Search
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2>Explore <span className="text-gradient">Categories</span></h2>
          <p className="text-secondary">Find exactly what you are looking for</p>
        </motion.div>
        
        <motion.div 
          className="categories-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { title: 'Apartments', icon: <Building size={32} />, count: '120+ Properties', bg: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-blue)', type: 'flat' },
            { title: 'Villas', icon: <HomeIcon size={32} />, count: '45+ Properties', bg: 'rgba(197, 160, 89, 0.1)', color: 'var(--accent-purple)', type: 'house' },
            { title: 'Plots', icon: <MapPin size={32} />, count: '80+ Properties', bg: 'rgba(226, 194, 117, 0.1)', color: 'var(--accent-cyan)', type: 'plot' },
            { title: 'PG / Co-living', icon: <Key size={32} />, count: '200+ Properties', bg: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-blue)', type: 'pg' },
          ].map((cat, idx) => (
            <motion.div 
              key={idx} 
              className="category-card glass-card" 
              variants={fadeInUp} 
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => navigate(`/properties?type=${cat.type}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon" style={{ background: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
              <p className="text-secondary">{cat.count}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="section container">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Featured <span className="text-gradient">Properties</span></h2>
          <Link to="/properties" className="btn btn-outline">View All</Link>
        </motion.div>
        
        {loadingProperties ? (
          <p className="text-center p-4 text-secondary">Loading properties...</p>
        ) : featuredProperties.length > 0 ? (
          <motion.div 
            className="properties-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredProperties.map((property) => (
              <motion.div 
                key={property._id} 
                variants={fadeInUp} 
                whileHover={{ y: -15, transition: { duration: 0.4 } }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="empty-state glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h3>No properties found</h3>
            <p className="text-secondary">Be the first to list a property with us!</p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="section container">
        <motion.div 
          className="section-header" 
          style={{ justifyContent: 'center', textAlign: 'center' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div>
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p className="text-secondary">Three simple steps to find your perfect place</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="how-it-works-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { step: '01', title: 'Search Property', desc: 'Browse our extensive list of properties using advanced filters.' },
            { step: '02', title: 'Meet Agent', desc: 'Connect with our expert agents for viewings and negotiations.' },
            { step: '03', title: 'Close the Deal', desc: 'Complete the paperwork securely and get your keys.' },
          ].map((item, idx) => (
            <motion.div key={idx} className="step-card glass-card" variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p className="text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <div className="why-choose-us-grid">
            <motion.div 
              className="why-choose-content"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp}>Why Choose <span className="text-gradient">Aura Estates</span></motion.h2>
              <motion.p className="text-secondary mb-4" variants={fadeInUp}>
                We are committed to providing the highest level of service in the real estate industry. Our expertise and dedication ensure that you get the best value for your investment.
              </motion.p>
              <motion.ul className="benefits-list" variants={staggerContainer}>
                {[
                  'Transparency in every transaction',
                  'Zero hidden charges or fees',
                  'Verified properties and owners',
                  'Dedicated legal support team'
                ].map((text, i) => (
                  <motion.li key={i} variants={fadeInUp}><CheckCircle className="text-accent-blue" size={20} /> {text}</motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div 
              className="why-choose-stats"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className="stat-box glass-card" variants={scaleIn} whileHover={{ scale: 1.05 }}>
                <Shield className="text-accent-blue mb-2" size={32} />
                <h3>100% Secure</h3>
                <p className="text-secondary text-sm">Safe & transparent</p>
              </motion.div>
              <motion.div className="stat-box glass-card" variants={scaleIn} whileHover={{ scale: 1.05 }}>
                <Clock className="text-accent-purple mb-2" size={32} />
                <h3>24/7 Support</h3>
                <p className="text-secondary text-sm">Always here to help</p>
              </motion.div>
              <motion.div className="stat-box glass-card" variants={scaleIn} whileHover={{ scale: 1.05 }}>
                <Award className="text-accent-cyan mb-2" size={32} />
                <h3>Top Rated</h3>
                <p className="text-secondary text-sm">Award winning agency</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section container">
        <motion.div 
          className="section-header" 
          style={{ justifyContent: 'center', textAlign: 'center' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div>
            <h2>What Our <span className="text-gradient">Clients</span> Say</h2>
            <p className="text-secondary">Read success stories from our happy customers</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="testimonials-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { name: 'Sarah Jenkins', role: 'Homeowner', text: 'Aura Estates made buying our first home an absolute breeze. The agent was incredibly patient and understood exactly what we wanted.' },
            { name: 'David Chen', role: 'Property Investor', text: 'I have bought multiple properties through Aura. Their market insights and transparent process keep me coming back every time.' },
          ].map((test, idx) => (
            <motion.div key={idx} className="testimonial-card glass-card" variants={fadeInUp} whileHover={{ scale: 1.02 }}>
              <Quote className="text-accent-blue mb-4 opacity-50" size={40} />
              <p className="testimonial-text mb-4">"{test.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{test.name.charAt(0)}</div>
                <div>
                  <h4>{test.name}</h4>
                  <p className="text-secondary text-sm">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
