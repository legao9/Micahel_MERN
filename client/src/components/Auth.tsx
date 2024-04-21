import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '../config/config.js';
import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

export const Auth = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [msg, setMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, password } = form;
        const URL = config.serverUrl;
        const { data: {message ,token} } = await axios.post(`${URL}/auth/login`,
         { username, password });
        setMsg(message);
        console.log(token);
        cookies.set('id', token.keyID);
        cookies.set('token', token.password);
        cookies.set('username', username);
        if(token.keyID > 0)
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
                        <p>{msg}</p>
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


