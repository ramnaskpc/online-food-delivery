import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css'

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

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
          toast.error('Failed to load profile');
        }
      } catch (err) {
        toast.error('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['street', 'city', 'state', 'zip'].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, profile, {
        headers: { token }
      });

      if (data.success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="edit-profile-page">
      <form className="edit-profile-form" onSubmit={handleUpdate}>
        <h2>Edit Profile</h2>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          required/>

        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={profile.address.street}
          onChange={handleChange}/>

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={profile.address.city}
          onChange={handleChange}/>

        <label>State:</label>
        <input
          type="text"
          name="state"
          value={profile.address.state}
          onChange={handleChange}/>

        <label>Zip Code:</label>
        <input
          type="text"
          name="zip"
          value={profile.address.zip}
          onChange={handleChange} />

        <div className="edit-profile-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/profile')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
