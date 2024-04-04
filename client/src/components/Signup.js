import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image

const Signin = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminCode, setAdminCode] = useState('');
    const [showFailureMessage, setShowFailureMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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

    const handleSignin = async () => {
        let role = 'user';
        if (isAdmin) {
            if (adminCode === 'A123') {
                role = 'admin';
            } else {
                setShowFailureMessage(true);
                setSuccessMessage('Wrong admin code.');
                handleReset(); // Reset all fields
                return;
            }
        }
    
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                name,
                password,
                phone,
                email,
                role
            });
    
            if (response.status === 200) {
                // User created successfully
                setShowFailureMessage(false);
                setSuccessMessage('User inserted successfully.');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // User already exists
                setShowFailureMessage(true);
                setSuccessMessage('User already exists.');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
                handleReset(); // Reset all fields
            } else {
                // Other errors
                setShowFailureMessage(true);
                handleReset(); // Reset all fields
                console.error('Signin failed:', error);
            }
        }
    };
    

    const handleReset = () => {
        setName('');
        setPassword('');
        setPhone('');
        setEmail('');
        setAdminCode('');
        // Reset failure message state after 4 seconds
    setTimeout(() => {
        setShowFailureMessage(false);
    }, 2000);
    // Reset success message state after 4 seconds
    setTimeout(() => {
        setSuccessMessage('');
    }, 2000);
    };

    const handleLogoff = () => {
        // Perform logoff logic here
        // For example, clearing local storage, session, or token
        // Then redirect to the home page
        navigate('/');
        window.location.reload(); // Reload the page to ensure a fresh session
    };

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
                <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Create A Stockwise account</h3>
                <label htmlFor="name">Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
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
                <label htmlFor="phone">Phone:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle} 
                /> <br></br>
                <label htmlFor="email">Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle} 
                /> <br></br>
                <label htmlFor="role">Role:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="checkbox" 
                    id="admin" 
                    checked={isAdmin} 
                    onChange={(e) => setIsAdmin(e.target.checked)}
                /> Admin&nbsp;&nbsp;
                <input 
                    type="checkbox" 
                    id="user" 
                    checked={!isAdmin} 
                    onChange={(e) => setIsAdmin(!e.target.checked)}
                /> User <br></br>
                {isAdmin && (
                    <>
                        <label htmlFor="adminCode">Admin Code:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <input 
                            type="text" 
                            id="adminCode" 
                            value={adminCode} 
                            onChange={(e) => setAdminCode(e.target.value)}
                            style={inputStyle} 
                        /> <br></br>
                    </>
                )}
                <br></br>
                <button onClick={handleSignin} style={buttonStyle}>Signup</button>&nbsp;
                <button onClick={handleReset} style={buttonStyle}>Reset</button>
                {showFailureMessage && <p>Signup failed .. !! </p>}
                {successMessage && <p>{successMessage}</p>}
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <footer>
            <p>© 2024 StockWise. All rights reserved.</p>
      </footer>
        </div>
    );
};

export default Signin;