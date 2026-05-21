import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, Share2, Heart, Shield, CheckCircle, Mail, Phone, ChevronLeft } from 'lucide-react';
import { AuthContext, API_URL } from '../context/AuthContext';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  
  const [inquiryState, setInquiryState] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this property...'
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/properties/${id}`);
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
          
          // Formulate full image path
          const fullImgUrl = data.data.image && data.data.image.startsWith('/uploads/')
            ? `${data.data.image}`
            : data.data.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
            
          setActiveImage(fullImgUrl);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Autofill user details when user state loads
  useEffect(() => {
    if (user) {
      setInquiryState(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setInquiryError('');
    setSubmittingInquiry(true);

    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId: id,
          name: inquiryState.name,
          email: inquiryState.email,
          phone: inquiryState.phone,
          message: inquiryState.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send inquiry');
      }

      setRequestSent(true);
      setInquiryState(prev => ({
        ...prev,
        message: 'I am interested in this property...'
      }));
      setTimeout(() => setRequestSent(false), 5000);
    } catch (error) {
      console.error(error);
      setInquiryError(error.message || 'Error occurred while sending request');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="property-details-page animate-fade-in" style={{ paddingTop: '100px' }}>
        <div className="container text-center" style={{ padding: '5rem 0' }}>
          <h2>Loading Property Details...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-details-page animate-fade-in" style={{ paddingTop: '100px' }}>
        <div className="container text-center" style={{ padding: '5rem 0' }}>
          <h2>Property Not Found</h2>
          <p className="text-secondary">The listing you are looking for does not exist or has been removed.</p>
          <Link to="/properties" className="btn btn-primary mt-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={20} /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Format type name
  const getFormattedType = (type) => {
    switch (type) {
      case 'flat': return 'Apartment';
      case 'house': return 'Villa / House';
      case 'plot': return 'Land Plot';
      case 'pg': return 'PG Accommodation';
      default: return type;
    }
  };

  return (
    <div className="property-details-page animate-fade-in" style={{ paddingTop: '80px' }}>
      
      <div className="container mt-4 mb-4">
        <Link to="/properties" className="back-link">
          <ChevronLeft size={20} /> Back to Properties
        </Link>
      </div>

      <div className="container">
        <div className="details-header">
          <div>
            <div className="property-tags">
              <span className="tag status-tag">{property.status}</span>
              <span className="tag type-tag" style={{ textTransform: 'capitalize' }}>
                {getFormattedType(property.type)}
              </span>
            </div>
            <h1 className="details-title">{property.title}</h1>
            <p className="details-location"><MapPin size={18} className="text-accent-blue" /> {property.location}</p>
          </div>
          <div className="details-price-box">
            <h2 className="details-price">${property.price.toLocaleString()}</h2>
            <div className="action-icons">
              <button className="icon-btn-circle"><Share2 size={20} /></button>
              <button className="icon-btn-circle"><Heart size={20} /></button>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Main Content */}
          <div className="details-main">
            {/* Image Gallery */}
            <div className="gallery-section glass-panel">
              <div className="main-image-container">
                <img src={activeImage} alt={property.title} className="main-image" />
              </div>
              <div className="thumbnail-strip">
                <div className="thumbnail active">
                  <img src={activeImage} alt="Thumbnail" />
                </div>
              </div>
            </div>

            {/* Overview & Specs */}
            <div className="info-section glass-panel">
              <h2>Property Overview</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <Bed className="text-accent-blue" size={24} />
                  <div>
                    <span className="spec-label">Bedrooms</span>
                    <span className="spec-value">{property.beds || 0} Beds</span>
                  </div>
                </div>
                <div className="spec-item">
                  <Bath className="text-accent-purple" size={24} />
                  <div>
                    <span className="spec-label">Bathrooms</span>
                    <span className="spec-value">{property.baths || 0} Baths</span>
                  </div>
                </div>
                <div className="spec-item">
                  <Square className="text-accent-cyan" size={24} />
                  <div>
                    <span className="spec-label">Area</span>
                    <span className="spec-value">{property.sqft || 0} sqft</span>
                  </div>
                </div>
                <div className="spec-item">
                  <Calendar className="text-accent-blue" size={24} />
                  <div>
                    <span className="spec-label">Listed Date</span>
                    <span className="spec-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="info-section glass-panel">
              <h2>Description</h2>
              <p className="text-secondary leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="info-section glass-panel">
                <h2>Features & Amenities</h2>
                <ul className="features-list">
                  {property.amenities.map((feature, idx) => (
                    <li key={idx}><CheckCircle size={18} className="text-accent-blue" /> {feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Map Placeholder */}
            <div className="info-section glass-panel map-section">
              <h2>Location</h2>
              <div className="map-placeholder">
                <MapPin size={48} className="text-accent-blue mb-2" />
                <h3>Interactive Map</h3>
                <p className="text-secondary">Coordinates: {property.lat || 40.7128}, {property.lng || -74.0060}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="details-sidebar">
            
            {/* Agent Card */}
            <div className="agent-contact-card glass-panel sticky-sidebar">
              <h3>Contact Agent</h3>
              
              <div className="agent-profile">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                  alt={property.agent?.name || 'Sarah Johnson'} 
                />
                <div>
                  <h4>{property.agent?.name || 'Sarah Johnson'}</h4>
                  <p className="text-secondary text-sm" style={{ textTransform: 'capitalize' }}>
                    {property.agent?.role || 'Senior Property Agent'}
                  </p>
                </div>
              </div>

              <div className="agent-details">
                <div className="contact-row">
                  <Phone size={18} className="text-accent-blue" /> 
                  <span>{property.agent?.phone || '+1 (555) 123-4567'}</span>
                </div>
                <div className="contact-row">
                  <Mail size={18} className="text-accent-blue" /> 
                  <span style={{ wordBreak: 'break-all' }}>{property.agent?.email || 'sarah.j@auraestates.com'}</span>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSendRequest}>
                {inquiryError && (
                  <div 
                    style={{ 
                      color: '#ef4444', 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      fontSize: '0.85rem', 
                      marginBottom: '10px',
                      textAlign: 'center' 
                    }}
                  >
                    {inquiryError}
                  </div>
                )}
                
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="input-glass" 
                  value={inquiryState.name}
                  onChange={(e) => setInquiryState({ ...inquiryState, name: e.target.value })}
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="input-glass" 
                  value={inquiryState.email}
                  onChange={(e) => setInquiryState({ ...inquiryState, email: e.target.value })}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Your Phone" 
                  className="input-glass" 
                  value={inquiryState.phone}
                  onChange={(e) => setInquiryState({ ...inquiryState, phone: e.target.value })}
                  required 
                />
                <textarea 
                  placeholder="I am interested in this property..." 
                  className="input-glass" 
                  rows="4" 
                  value={inquiryState.message}
                  onChange={(e) => setInquiryState({ ...inquiryState, message: e.target.value })}
                  required
                />
                
                <button type="submit" className="btn btn-primary w-full mt-2" disabled={submittingInquiry}>
                  {submittingInquiry ? 'Sending...' : requestSent ? 'Request Sent!' : 'Send Request'}
                </button>
              </form>
              
              <div className="secure-notice">
                <Shield size={16} /> Your information is secure
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
