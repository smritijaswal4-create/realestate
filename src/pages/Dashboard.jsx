import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Home, MessageSquare, Heart, Settings, LogOut, 
  Plus, Edit, Trash2, X, Upload, MapPin, Mail, Phone 
} from 'lucide-react';
import { AuthContext, API_URL } from '../context/AuthContext';
import './Dashboard.css';

const allAmenitiesList = ['Gym', 'Pool', 'Parking', 'Garden', 'Security', 'Furnished', 'WiFi', 'Meals'];
const defaultAvatarPlaceholder = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

const Dashboard = () => {
  const { user, token, loading, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Listings State
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Settings State
  const [settingsState, setSettingsState] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsUpdating, setSettingsUpdating] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  
  // Property Form State
  const [formState, setFormState] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'flat',
    category: 'buy',
    amenities: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch Agent Listings
  const fetchListings = async () => {
    if (!token || user?.role !== 'agent') return;
    setListingsLoading(true);
    try {
      const response = await fetch(`${API_URL}/properties/agent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setListingsLoading(false);
    }
  };

  // Fetch Agent Inquiries
  const fetchInquiries = async () => {
    if (!token || user?.role !== 'agent') return;
    setInquiriesLoading(true);
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // Fetch details on mount or auth refresh
  useEffect(() => {
    fetchListings();
    fetchInquiries();
  }, [user, token]);

  // Fetch inquiries when activeTab switches to messages
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchInquiries();
    }
  }, [activeTab]);

  // Sync settings inputs with logged-in user profile
  useEffect(() => {
    if (user) {
      setSettingsState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      });
      setAvatarFile(null);
      setAvatarPreview('');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl">Loading Dashboard...</h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Handle Logout
  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setFormState({
      title: '',
      price: '',
      description: '',
      location: '',
      beds: '0',
      baths: '0',
      sqft: '0',
      type: 'flat',
      category: 'buy',
      amenities: []
    });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setIsEditing(false);
    setCurrentPropertyId(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (property) => {
    setFormState({
      title: property.title || '',
      price: property.price || '',
      description: property.description || '',
      location: property.location || '',
      beds: property.beds !== undefined ? String(property.beds) : '0',
      baths: property.baths !== undefined ? String(property.baths) : '0',
      sqft: property.sqft !== undefined ? String(property.sqft) : '0',
      type: property.type || 'flat',
      category: property.category || 'buy',
      amenities: property.amenities || []
    });
    setImageFile(null);
    setImagePreview(property.image ? `${property.image}` : '');
    setFormError('');
    setIsEditing(true);
    setCurrentPropertyId(property._id);
    setShowModal(true);
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Checkbox Changes for Amenities
  const handleAmenityChange = (amenity) => {
    setFormState(prev => {
      const alreadySelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: alreadySelected
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  // Handle Image File Changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle Avatar Selection Changes
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submission (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    // Validations
    if (!formState.title || !formState.price || !formState.location || !formState.description) {
      setFormError('Please fill out all required fields.');
      setFormSubmitting(false);
      return;
    }

    if (!isEditing && !imageFile) {
      setFormError('Please upload a property image.');
      setFormSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('price', formState.price);
      formData.append('location', formState.location);
      formData.append('description', formState.description);
      formData.append('beds', formState.beds);
      formData.append('baths', formState.baths);
      formData.append('sqft', formState.sqft);
      formData.append('type', formState.type);
      formData.append('category', formState.category);
      formData.append('amenities', JSON.stringify(formState.amenities));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = isEditing 
        ? `${API_URL}/properties/${currentPropertyId}` 
        : `${API_URL}/properties`;
        
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save property listing');
      }

      setShowModal(false);
      fetchListings();
    } catch (error) {
      console.error(error);
      setFormError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Listing Deletion
  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        fetchListings();
      } else {
        alert(data.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred while deleting listing');
    }
  };

  // Handle Inquiry Deletion/Dismissal
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to dismiss this inquiry request?')) return;
    try {
      const response = await fetch(`${API_URL}/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        fetchInquiries();
      } else {
        alert(data.message || 'Failed to dismiss inquiry');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred while dismissing inquiry');
    }
  };

  // Handle Profile Settings Update Submission
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');
    setSettingsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('name', settingsState.name);
      formData.append('email', settingsState.email);
      formData.append('phone', settingsState.phone);
      
      if (settingsState.password) {
        formData.append('password', settingsState.password);
      }
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const result = await updateProfile(formData);
      setSettingsUpdating(false);

      if (result.success) {
        setSettingsSuccess('Profile settings updated successfully!');
        setSettingsState(prev => ({ ...prev, password: '' }));
        setAvatarFile(null);
      } else {
        setSettingsError(result.error || 'Failed to update profile settings');
      }
    } catch (error) {
      console.error(error);
      setSettingsError('Error updating profile settings. Please try again.');
      setSettingsUpdating(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in" style={{ paddingTop: '80px' }}>
      <div className="dashboard-container">
        
        {/* Sidebar */}
        <aside className="dashboard-sidebar glass-panel">
          <div className="sidebar-profile">
            <div className="profile-img" style={{ overflow: 'hidden' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar.startsWith('http') ? user.avatar : `${user.avatar}`} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div className="profile-info">
              <h3>{user.name}</h3>
              <p className="text-secondary" style={{ textTransform: 'capitalize' }}>
                {user.role === 'agent' ? 'Property Agent' : 'Property Seeker'}
              </p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={20} /> Overview
            </button>
            
            {user.role === 'agent' ? (
              <button 
                className={`sidebar-link ${activeTab === 'properties' ? 'active' : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                <Home size={20} /> My Listings
              </button>
            ) : (
              <button 
                className={`sidebar-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <Heart size={20} /> Saved Properties
              </button>
            )}

            <button 
              className={`sidebar-link ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={20} /> Requests & Messages
            </button>
            
            <button 
              className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} /> Settings
            </button>
            
            <button onClick={handleLogoutClick} className="sidebar-link text-red-500 mt-auto">
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <div className="dashboard-header glass-panel">
            <h2 style={{ textTransform: 'capitalize' }}>
              {activeTab === 'properties' ? 'My Listings' : activeTab === 'messages' ? 'Requests & Messages' : activeTab}
            </h2>
            {user.role === 'agent' && activeTab === 'properties' && (
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <Plus size={18} /> Add New Listing
              </button>
            )}
          </div>

          <div className="dashboard-main-area">
            {activeTab === 'overview' && (
              <div className="overview-grid">
                <div className="stat-card glass-card">
                  <h3>{user.role === 'agent' ? 'Total Listings' : 'Saved Properties'}</h3>
                  <div className="stat-value">
                    {user.role === 'agent' ? listings.length : '0'}
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <h3>Total Requests</h3>
                  <div className="stat-value">
                    {user.role === 'agent' ? inquiries.length : '0'}
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <h3>Phone Contact</h3>
                  <div className="stat-value" style={{ fontSize: '1.25rem', marginTop: '10px' }}>
                    {user.phone || 'Not Provided'}
                  </div>
                </div>
              </div>
            )}

            {user.role === 'agent' && activeTab === 'properties' && (
              <div className="properties-list glass-panel">
                {listingsLoading ? (
                  <p className="text-center p-4">Loading listings...</p>
                ) : listings.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(prop => (
                        <tr key={prop._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {prop.image && (
                                <img 
                                  src={`${prop.image}`} 
                                  alt="" 
                                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
                                />
                              )}
                              <span>{prop.title}</span>
                            </div>
                          </td>
                          <td>${prop.price.toLocaleString()}</td>
                          <td style={{ textTransform: 'capitalize' }}>{prop.type}</td>
                          <td>
                            <span className={`status-badge ${prop.status.toLowerCase().replace(' ', '-')}`}>
                              {prop.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="icon-btn text-accent-blue" 
                                onClick={() => handleOpenEditModal(prop)}
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                className="icon-btn text-red-500" 
                                onClick={() => handleDeleteClick(prop._id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <Home size={48} className="text-secondary mb-4" />
                    <h3>No properties listed yet</h3>
                    <p className="text-secondary">Click the button above to add your first property listing.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div className="messages-area glass-panel">
                <div className="empty-state">
                  <Heart size={48} className="text-secondary mb-4" />
                  <h3>No saved properties</h3>
                  <p className="text-secondary">When you heart properties, they will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="properties-list glass-panel">
                {inquiriesLoading ? (
                  <p className="text-center p-4">Loading requests...</p>
                ) : inquiries.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Client Details</th>
                        <th>Message</th>
                        <th>Received</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq._id}>
                          <td style={{ minWidth: '150px' }}>
                            <div style={{ fontWeight: '600' }}>
                              {inq.property?.title || 'Unknown Property'}
                            </div>
                            {inq.property?.price && (
                              <div className="text-secondary text-sm">
                                ${inq.property.price.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td style={{ minWidth: '180px' }}>
                            <div style={{ fontWeight: '500' }}>{inq.name}</div>
                            <div className="text-secondary text-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <Mail size={12} className="text-accent-blue" /> {inq.email}
                            </div>
                            <div className="text-secondary text-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <Phone size={12} className="text-accent-blue" /> {inq.phone}
                            </div>
                          </td>
                          <td>
                            <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                              "{inq.message}"
                            </p>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '100px' }}>
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button 
                              className="icon-btn text-red-500" 
                              onClick={() => handleDeleteInquiry(inq._id)}
                              title="Dismiss Inquiry"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <MessageSquare size={48} className="text-secondary mb-4" />
                    <h3>No new requests</h3>
                    <p className="text-secondary">When someone sends an inquiry on your properties, it will appear here.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 className="text-xl font-bold mb-2">Account Settings</h3>
                <p className="text-secondary mb-5">Update your profile information and password</p>

                {settingsSuccess && (
                  <div 
                    className="success-box mb-4 animate-fade-in" 
                    style={{ 
                      color: '#10b981', 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      border: '1px solid rgba(16, 185, 129, 0.2)', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      maxWidth: '500px'
                    }}
                  >
                    {settingsSuccess}
                  </div>
                )}

                {settingsError && (
                  <div 
                    className="error-box mb-4 animate-fade-in" 
                    style={{ 
                      color: '#ef4444', 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      maxWidth: '500px'
                    }}
                  >
                    {settingsError}
                  </div>
                )}

                <form onSubmit={handleSettingsSubmit} className="auth-form" style={{ marginTop: 0, maxWidth: '500px' }}>
                  
                  {/* Avatar Upload Container */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div 
                      className="profile-img" 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        fontSize: '2rem', 
                        marginBottom: '1rem', 
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: '50%',
                        border: '2px solid var(--accent-blue)',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
                      }}
                      onClick={() => document.getElementById('avatar-upload-input').click()}
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : user.avatar ? (
                        <img 
                          src={user.avatar.startsWith('http') ? user.avatar : `${user.avatar}`} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'var(--accent-gradient)', color: 'white' }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          textAlign: 'center',
                          padding: '2px 0'
                        }}
                      >
                        Edit
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => document.getElementById('avatar-upload-input').click()}
                    >
                      Choose Profile Image
                    </button>
                    
                    <input 
                      type="file" 
                      id="avatar-upload-input" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleAvatarChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="input-glass" 
                      value={settingsState.name}
                      onChange={(e) => setSettingsState({ ...settingsState, name: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="input-glass" 
                      value={settingsState.email}
                      onChange={(e) => setSettingsState({ ...settingsState, email: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      className="input-glass" 
                      value={settingsState.phone}
                      onChange={(e) => setSettingsState({ ...settingsState, phone: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password (leave blank to keep current)</label>
                    <input 
                      type="password" 
                      className="input-glass" 
                      placeholder="Enter new password"
                      value={settingsState.password}
                      onChange={(e) => setSettingsState({ ...settingsState, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Type (Read-only)</label>
                    <input 
                      type="text" 
                      className="input-glass" 
                      value={user.role === 'agent' ? 'Property Agent' : 'Property Seeker'} 
                      disabled
                      style={{ opacity: 0.6, textTransform: 'capitalize' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary mt-4" disabled={settingsUpdating}>
                    {settingsUpdating ? 'Updating Settings...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* Add / Edit Listing Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowModal(false)}>
          <div className="modal-content glass-panel animate-scale-in">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Property Listing' : 'Add New Property Listing'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div 
                className="error-box mb-4 animate-fade-in" 
                style={{ 
                  color: '#ef4444', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="auth-form" style={{ marginTop: 0 }}>
              <div className="form-group">
                <label>Property Title *</label>
                <input 
                  type="text" 
                  name="title"
                  className="input-glass" 
                  placeholder="e.g. Modern Villa with Pool" 
                  value={formState.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input 
                    type="number" 
                    name="price"
                    className="input-glass" 
                    placeholder="e.g. 500000" 
                    value={formState.price}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input 
                    type="text" 
                    name="location"
                    className="input-glass" 
                    placeholder="e.g. Austin, TX" 
                    value={formState.location}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  name="description"
                  className="input-glass" 
                  rows="3" 
                  placeholder="Describe details about the property..."
                  value={formState.description}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Property Type *</label>
                  <select 
                    name="type"
                    className="input-glass"
                    value={formState.type}
                    onChange={handleInputChange}
                  >
                    <option value="flat">Apartment (Flat)</option>
                    <option value="house">Villa (House)</option>
                    <option value="plot">Plot</option>
                    <option value="pg">PG / Co-living</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purpose *</label>
                  <select 
                    name="category"
                    className="input-glass"
                    value={formState.category}
                    onChange={handleInputChange}
                  >
                    <option value="buy">For Sale (Buy)</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input 
                    type="number" 
                    name="beds"
                    className="input-glass" 
                    value={formState.beds}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input 
                    type="number" 
                    name="baths"
                    className="input-glass" 
                    value={formState.baths}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group form-col-span-2">
                  <label>Area (sqft)</label>
                  <input 
                    type="number" 
                    name="sqft"
                    className="input-glass" 
                    placeholder="e.g. 1500" 
                    value={formState.sqft}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="checkbox-grid">
                  {allAmenitiesList.map(amn => (
                    <label key={amn} className="checkbox-label animate-fade-in">
                      <input 
                        type="checkbox"
                        checked={formState.amenities.includes(amn)}
                        onChange={() => handleAmenityChange(amn)}
                      />
                      {amn}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Property Image *</label>
                <div className="file-input-container" onClick={() => document.getElementById('image-upload').click()}>
                  <Upload size={24} className="text-secondary mb-2" />
                  <p className="text-sm text-secondary">
                    {imageFile ? imageFile.name : 'Click to upload property image'}
                  </p>
                  <input 
                    type="file" 
                    id="image-upload" 
                    accept="image/*"
                    style={{ display: 'none' }} 
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <div className="file-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
