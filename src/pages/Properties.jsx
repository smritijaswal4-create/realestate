import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Grid, Map, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import MapView from '../components/MapView';
import { API_URL } from '../context/AuthContext';
import './Properties.css';

const allAmenities = ['Gym', 'Pool', 'Parking', 'Garden', 'Security', 'Furnished', 'WiFi', 'Meals'];

const Properties = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  
  // Properties State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchLoc, setSearchLoc] = useState('');
  const [category, setCategory] = useState('all'); // 'all', 'buy', 'rent'
  const [type, setType] = useState('all'); // 'all', 'flat', 'house', 'plot', 'pg'
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Read query parameters from URL on mount/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const typeParam = params.get('type');
    const priceMinParam = params.get('priceMin');
    const priceMaxParam = params.get('priceMax');

    if (searchParam !== null) setSearchLoc(searchParam);
    if (categoryParam !== null) setCategory(categoryParam);
    if (typeParam !== null) setType(typeParam);
    if (priceMinParam !== null) setPriceMin(priceMinParam);
    if (priceMaxParam !== null) setPriceMax(priceMaxParam);
  }, [location.search]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchLoc) queryParams.append('search', searchLoc);
        if (category && category !== 'all') queryParams.append('category', category);
        if (type && type !== 'all') queryParams.append('type', type);
        if (priceMin) queryParams.append('priceMin', priceMin);
        if (priceMax) queryParams.append('priceMax', priceMax);
        if (selectedAmenities.length > 0) {
          queryParams.append('amenities', selectedAmenities.join(','));
        }

        const response = await fetch(`${API_URL}/properties?${queryParams.toString()}`);
        const data = await response.json();
        if (data.success) {
          setProperties(data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call slightly if there's a search term
    const timer = setTimeout(() => {
      fetchProperties();
    }, searchLoc ? 300 : 0);

    return () => clearTimeout(timer);
  }, [searchLoc, category, type, priceMin, priceMax, selectedAmenities]);

  return (
    <div className="properties-page section container animate-fade-in" style={{ paddingTop: '100px' }}>
      
      <div className="properties-header-top">
        <h1>Discover <span className="text-gradient">Properties</span></h1>
        
        <div className="view-toggle glass-panel">
          <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <Grid size={18} /> Grid
          </button>
          <button className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
            <Map size={18} /> Map
          </button>
        </div>
      </div>

      <div className="properties-layout">
        
        {/* Advanced Filters Sidebar */}
        <aside className="filters-sidebar glass-panel">
          <div className="filters-header">
            <h3><Filter size={18} /> Filters</h3>
            <button 
              className="text-accent-blue text-sm bg-transparent border-none cursor-pointer"
              onClick={() => {
                setSearchLoc(''); setCategory('all'); setType('all'); 
                setPriceMin(''); setPriceMax(''); setSelectedAmenities([]);
              }}
            >
              Clear All
            </button>
          </div>

          <div className="filter-section">
            <div className="search-field-small">
              <MapPin size={16} className="text-secondary" />
              <input 
                type="text" 
                placeholder="Location or Keyword..." 
                value={searchLoc}
                onChange={e => setSearchLoc(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Purpose</h4>
            <div className="pill-group">
              <button className={`pill-btn ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>Any</button>
              <button className={`pill-btn ${category === 'buy' ? 'active' : ''}`} onClick={() => setCategory('buy')}>Buy</button>
              <button className={`pill-btn ${category === 'rent' ? 'active' : ''}`} onClick={() => setCategory('rent')}>Rent</button>
            </div>
          </div>

          <div className="filter-section">
            <h4>Property Type</h4>
            <div className="type-grid">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'flat', label: 'Apartment' },
                { id: 'house', label: 'Villa' },
                { id: 'plot', label: 'Plot' },
                { id: 'pg', label: 'PG' }
              ].map(t => (
                <button 
                  key={t.id} 
                  className={`type-btn ${type === t.id ? 'active' : ''}`}
                  onClick={() => setType(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range ($)</h4>
            <div className="price-inputs">
              <div className="price-field">
                <span className="price-prefix">$</span>
                <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              </div>
              <span className="price-separator">-</span>
              <div className="price-field">
                <span className="price-prefix">$</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Amenities</h4>
            <div className="amenities-chips">
              {allAmenities.map(amn => (
                <button 
                  key={amn} 
                  className={`chip-btn ${selectedAmenities.includes(amn) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(amn)}
                >
                  {amn}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Results Area */}
        <main className="properties-results">
          {loading ? (
            <div className="no-results glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3>Loading properties...</h3>
            </div>
          ) : (
            <>
              <div className="results-count mb-4">
                Showing {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
              </div>

              {viewMode === 'grid' ? (
                <div className="properties-grid-advanced">
                  {properties.length > 0 ? (
                    properties.map(property => (
                      <PropertyCard key={property._id || property.id} property={property} />
                    ))
                  ) : (
                    <div className="no-results glass-panel">
                      <h3>No properties found</h3>
                      <p className="text-secondary">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="map-view-container glass-panel">
                  <MapView properties={properties} />
                </div>
              )}
            </>
          )}
        </main>
      </div>

    </div>
  );
};

export default Properties;
