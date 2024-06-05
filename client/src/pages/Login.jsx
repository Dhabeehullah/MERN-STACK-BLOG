import React, { useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { setCurrentUser } = useContext(UserContext);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, data);
            const user = response.data;
            setCurrentUser(user);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className='signin-container'>
            <section>
                <h2>Sign In!</h2>
                <form className='signin-form' onSubmit={handleSubmit}>
                    {error && <p className='error-message'>{error}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder='Email'
                        id="register-email"
                        value={data.email}
                        onChange={handleInput}
                        autoFocus
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        id="register-password"
                        value={data.password}
                        onChange={handleInput}
                    />
                    <div className='sign-button'>
                        <button type="submit" className='button-40'>Sign In</button>
                    </div>
                </form>
                <p className='login-signup'>
                    Don't have an account? <Link to='/register'>Sign Up</Link>
                </p>
            </section>
        </div>
    );
};

export default Login;
