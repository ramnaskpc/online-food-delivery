import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });

      if (data.success) {
        setProfile(data.user);
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (err) {
      toast.error('Failed to fetch profile');
    }
  };
  fetchProfile();
}, []);


  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile_page">
      <div className="profile_card">
        <h1>Name: {profile.name}</h1>
        <p><strong>Email:</strong>{profile.email}</p>

        {profile.address ? (
          <p>
            <strong>Address:</strong><br />
            {profile.address.street || '-'}, {profile.address.city || '-'}<br />
            {profile.address.state || '-'} – {profile.address.zip || '-'}
          </p>
        ) : (
          <p><strong>Address:</strong> Not available</p>
        )}

        <div className="profile_actions">
          <button onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
