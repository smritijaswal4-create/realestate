import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const imageUrl = property.image && property.image.startsWith('/uploads/')
    ? `${property.image}`
    : property.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  return (
    <Link to={`/properties/${property?._id || property?.id || 1}`} className="property-card glass-card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div 
        className="property-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="property-tag">{property.status || 'For Sale'}</div>
      </div>
      <div className="property-content">
        <h3 className="property-price">${(property.price || 450000).toLocaleString()}</h3>
        <h4 className="property-title">{property.title || 'Modern Apartment'}</h4>
        <p className="property-location">
          <MapPin size={16} className="text-accent-blue" /> 
          {property.location || 'New York'}
        </p>
        <div className="property-features">
          <span><Bed size={14} /> {property.beds || 0} Beds</span>
          <span><Bath size={14} /> {property.baths || 0} Baths</span>
          <span><Square size={14} /> {property.sqft || 0} sqft</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
