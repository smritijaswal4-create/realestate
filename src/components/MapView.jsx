import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ properties }) => {
  // Center map based on properties or default to US
  const center = properties.length > 0 
    ? [properties[0].lat, properties[0].lng] 
    : [39.8283, -98.5795];

  const zoom = properties.length > 0 ? 4 : 4;

  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map(property => (
          property.lat && property.lng && (
            <Marker key={property.id} position={[property.lat, property.lng]}>
              <Popup className="property-popup">
                <div className="popup-content">
                  <img src={property.image} alt={property.title} className="popup-img" />
                  <div className="popup-info">
                    <h4>{property.title}</h4>
                    <p className="text-accent-blue">${property.price.toLocaleString()}</p>
                    <Link to={`/properties/${property.id}`} className="btn btn-primary popup-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
