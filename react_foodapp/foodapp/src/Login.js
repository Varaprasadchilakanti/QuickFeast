import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling

const Login = ({ setUserName, setEmail }) => {
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message on each login attempt

        const response = await fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setUserName(data.userName); // Set username in App state
            setEmail(data.email); // Set email in App state
            navigate('/'); // Redirect to home
        } else {
            setErrorMessage(data.message); // Set error message for UI display
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-image"></div> {/* Placeholder for the image */}
                <div className="login-container">
                    <h2 className="welcome-text">Welcome Back!</h2>
                    <h4 className="login-heading">Login to Your Account</h4>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
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
                        <div className="remember-forgot">
                            <label>
                                <input type="checkbox" />
                                <span className="remember-text">Remember Me</span>
                            </label>
                            <Link to="#" className="forgot-password">Forgot Password?</Link>
                        </div>
                        <button type="submit" className="submit-button">LOGIN</button>
                    </form>
                    <div className="create-account">
                        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                    </div>
                    <p className="greeting">Hello! Let’s Make Your Day Delicious!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
