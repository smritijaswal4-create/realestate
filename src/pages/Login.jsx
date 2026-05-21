import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="auth-container glass-panel">
          <div className="auth-content">
            <div className="text-center mb-5">
              <h1 className="text-4xl font-bold mb-2">Welcome <span className="text-gradient">Back</span></h1>
              <p className="text-secondary">Login to manage your properties and requests</p>
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

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    className="input-glass pl-10" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm text-accent-blue hover-underline">Forgot Password?</a>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                <LogIn size={20} /> {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="text-center mt-4">
              Don't have an account? <Link to="/signup" className="text-accent-blue font-bold hover-underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
