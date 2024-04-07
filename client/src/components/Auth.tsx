import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

export const Auth = () => {
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, password } = form;
        const URL = 'http://localhost:5000/auth';
        const { data: { token} } = await axios.post(`${URL}/login`,
         { username, password });

        cookies.set('token', token);
        cookies.set('username', username);
     

        window.location.reload();
    }

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>Sign In</p>
                    <form onSubmit={handleSubmit}>
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                            <input 
                                name="username" 
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input 
                                name="password" 
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth__form-container_fields-content_button">
                            <button>Sign In</button>
                        </div>
                    </form>
                </div> 
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}


