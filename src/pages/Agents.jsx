import React, { useState, useEffect } from 'react';
import { Star, Mail, Phone } from 'lucide-react';
import { API_URL } from '../context/AuthContext';
import './Agents.css';

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/agents`);
        const data = await response.json();
        if (data.success) {
          setAgents(data.data);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="agents-page section container animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="text-center mb-5">
        <h1 className="text-4xl font-bold mb-4">Meet Our <span className="text-gradient">Expert Agents</span></h1>
        <p className="text-secondary max-w-2xl mx-auto">
          Our team of dedicated professionals is here to help you find the perfect property. With years of experience and deep market knowledge, they ensure a smooth and successful real estate journey.
        </p>
      </div>

      {loading ? (
        <div className="text-center p-4 glass-panel" style={{ padding: '4rem 2rem' }}>
          <h3 className="text-lg">Loading our expert agents...</h3>
        </div>
      ) : agents.length > 0 ? (
        <div className="agents-grid">
          {agents.map(agent => {
            const avatarUrl = agent.avatar 
              ? (agent.avatar.startsWith('http') ? agent.avatar : `http://localhost:5000${agent.avatar}`)
              : defaultAvatar;
            return (
              <div key={agent._id} className="agent-card glass-card">
                <img src={avatarUrl} alt={agent.name} className="agent-image" />
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p className="text-accent-blue mb-2">Property Consultant</p>
                  <div className="agent-stats mb-4">
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" /> 4.9 Rating
                    </span>
                    <span className="text-secondary">|</span>
                    <span className="text-secondary">{agent.properties} {agent.properties === 1 ? 'Property' : 'Properties'}</span>
                  </div>
                  <div className="agent-actions">
                    <a 
                      href={`mailto:${agent.email}`} 
                      className="btn btn-primary flex-1" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                      <Mail size={16} /> Contact
                    </a>
                    <a 
                      href={`tel:${agent.phone}`} 
                      className="btn btn-outline p-2" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3>No agents found</h3>
          <p className="text-secondary">There are no property agents registered at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Agents;
