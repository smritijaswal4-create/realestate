import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup(formData);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to register account');
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="auth-container glass-panel">
          <div className="auth-content">
            <div className="text-center mb-5">
              <h1 className="text-4xl font-bold mb-2">Create <span className="text-gradient">Account</span></h1>
              <p className="text-secondary">Join Aura Estates to find or list properties</p>
            </div>

            {error && (
              <div 
                className="error-box mb-4" 
                style={{ 
                  color: '#ef4444', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="auth-form">
              
              <div className="role-selector mb-4">
                <div 
                  className={`role-option ${formData.role === 'seeker' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, role: 'seeker'})}
                >
                  <User size={20} /> Property Seeker
                </div>
                <div 
                  className={`role-option ${formData.role === 'agent' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, role: 'agent'})}
                >
                  <UserPlus size={20} /> Agent / Owner
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    className="input-glass pl-10" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    className="input-glass pl-10" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={20} />
                  <input 
                    type="tel" 
                    className="input-glass pl-10" 
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={20} />
                  <input 
                    type="password" 
                    className="input-glass pl-10" 
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                <UserPlus size={20} /> {loading ? 'Registering...' : 'Register Account'}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account? <Link to="/login" className="text-accent-blue font-bold hover-underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
