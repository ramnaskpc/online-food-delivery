import React, { useState } from 'react'
import "./Login.css"
import axios from "axios"
import { backendUrl } from '../../App'
import {toast} from "react-toastify"

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const OnSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', {email, password})
      console.log(response);
      if(response.data.success){
        setToken(response.data.token)
      }else{
        toast.error(response.data.message)
      }
      }catch(error){

      }
    }

 return (
    <div className="admin-panel-container">
      <div className="admin-panel-box">
        <h1 className='login-title'>Admin Panel</h1>
        <form onSubmit={OnSubmitHandler}>
          <div className='form-group'>
            <p className='form-label'>Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className='form-input'
              placeholder='Enter email'
              required
            />
          </div>
          <div className='form-group'>
            <p className="form-label">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className='form-input'
              placeholder='Enter password'
              required
            />
          </div>
          <button className="form-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
