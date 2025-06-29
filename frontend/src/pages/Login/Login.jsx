import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { FoodContext } from '../../context/FoodContext';
import { backendUrl } from '../../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken , getUsercart} = useContext(FoodContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
    
      if (currentState === 'Sign Up') {
        if (!name || !email || !password) {
          toast.error('All fields are required for sign up');
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          address: {
           street: '',
           city: '',
           state: '',
           zip: ''
  }
        });

        if (response.data.success) {
          setToken(response.data.token);
          getUsercart(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success(response.data.message || 'Registered successfully');
        } else {
          toast.error(response.data.message || 'Sign up failed');
        }

      } else {
        if (!email || !password) {
          toast.error('Email and password are required');
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success(response.data.message || 'Logged in successfully');
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="auth-form">
        <div className="form-header">
          <p className="form-title">{currentState}</p>
        </div>

        {currentState === 'Sign Up' && (
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="form-input"
            placeholder="Full Name"
            required/>
        )}

        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-input"
          placeholder="Email"
          required />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-input"
          placeholder="Password"
          required/>

        <div className="form-footer">
          <p className="fgt-password">Forget Password?</p>
          {currentState === 'Login' ? (
            <p className="toggle-auth-state" onClick={() => setCurrentState('Sign Up')}>Create Account</p>
          ) : (
            <p className="toggle-auth-state" onClick={() => setCurrentState('Login')}>Login Here</p>
          )}
        </div>

        <button type="submit" className="form">
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
