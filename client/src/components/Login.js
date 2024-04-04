import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showFailureMessage, setShowFailureMessage] = useState(false);
    const navigate = useNavigate();

    const containerStyle = {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        color: 'white',
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: 'white',
    };

    const buttonStyle = {
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #6a6a6a, #668cb8)',
        color: 'white',
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
    
            console.log('Response from server:', response.data); // Add this line
    
            if (response.data.message === 'Login success') {
                // Check the user role
                if (response.data.role === 'user') {
                    // Redirect to user dashboard
                    navigate('/dashboard');
                } else if (response.data.role === 'admin') {
                    // Redirect to admin dashboard or admin page
                    navigate('/admin');
                }
            } else {
                setShowFailureMessage(true);
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            setShowFailureMessage(true);
            setUsername('');
            setPassword('');
        }
    };

    const handleReset = () => {
        setUsername('');
        setPassword('');
    };

    const handleLogoff = () => {
        // Perform logoff logic here
        // For example, clearing local storage, session, or token
        // Then redirect to the home page
        navigate('/');
        window.location.reload(); // Reload the page to ensure a fresh session
    };
    //
    return (
        <div className="container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}> {/* Add the background image to the container */}
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="tagline">
          <h2>Empowering Financial Decisions with AI</h2>
        </div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/contactus">ContactUs</Link></li>
            <li><Link to="/login">Admin</Link></li>
            <li><button onClick={handleLogoff}>Logoff</button></li>
          </ul>
        </nav>
      </header>
            <div style={containerStyle}>
            <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Good to see you !!</h3>
                <label htmlFor="username">Username:&nbsp;</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="password">Password:&nbsp;&nbsp;</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle} 
                /> <br></br>
                <button onClick={handleLogin} style={buttonStyle}>Login</button>&nbsp;
                <button onClick={handleReset} style={buttonStyle}>Reset</button>
                {showFailureMessage && <p>Login failed. Please try again.</p>}
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <footer>
        <p>© 2024 StockWise. All rights reserved.</p>
      </footer>
        </div>
        
         
      
    );
};

export default Login;
