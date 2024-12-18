import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(''); // Reset error message

        const response = await fetch('http://localhost:3002/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, country, password }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            alert('Registration successful!');
            navigate('/login');
        } else {
            setErrorMessage(data.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-image"></div>
                <div className="register-container">
                    <h2 className="welcome-text">Create Your Account</h2>
                    {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Registering...' : 'REGISTER'}
                        </button>
                    </form>
                    <div className="login-link">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
