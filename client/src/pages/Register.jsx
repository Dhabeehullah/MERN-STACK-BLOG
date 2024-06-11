import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [datas, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (datas.password !== datas.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`/api/users/register`, datas);
      const newUser = response.data;
      console.log(newUser);
      if (!newUser) {
        setError("Couldn't register");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    }
  };

  const handleInput = (e) => {
    setData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className='register-container'>
      <section>
        <h2>Register!</h2>
        <form className='register-form' onSubmit={handleSubmit}>
          {error && <p className='error-message'>{error}</p>}
          <input type="text" name="name" placeholder='Full Name' id="register-id" value={datas.name} onChange={handleInput} />
          <input type="email" name="email" placeholder='Email' id="register-email" value={datas.email} onChange={handleInput} />
          <input type="password" name="password" placeholder='Password' id="register-password" value={datas.password} onChange={handleInput} />
          <input type="password" name="confirmPassword" placeholder='Confirm Password' id="register-confirmpassword" value={datas.confirmPassword} onChange={handleInput} />
          <button type="submit" className='button-40'>Register</button>
        </form>
        <p className='register-signin'>Already have an account? <Link to='/login'>Sign in</Link></p>
      </section>
    </div>
  );
};

export default Register;
