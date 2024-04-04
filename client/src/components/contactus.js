import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image

const ContactUs = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
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

    const messageHeaderStyle = {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
    };

    const handleContactUs = async () => {
        try {
            const response = await axios.post('http://localhost:5000/contactus', {
                name,
                address,
                zipCode,
                phone,
                email,
                message
            });

            if (response.data.message === 'Contact details submitted successfully') {
                setShowFailureMessage(false);
                setSuccessMessage('Message sent successfully.');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setShowFailureMessage(true);
                setSuccessMessage('Failed to send message.');
                // Clear form fields on failure
                setName('');
                setAddress('');
                setZipCode('');
                setPhone('');
                setEmail('');
                setMessage('');
            }
        } catch (error) {
            setShowFailureMessage(true);
            setSuccessMessage('Failed to send message.');
            // Clear form fields on failure
            setName('');
            setAddress('');
            setZipCode('');
            setPhone('');
            setEmail('');
            setMessage('');
            console.error('Failed to send message:', error);
        }
    };

    const handleReset = () => {
        setName('');
        setAddress('');
        setZipCode('');
        setPhone('');
        setEmail('');
        setMessage('');
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
                <h3 style={messageHeaderStyle}>Let's chat</h3>
                <label htmlFor="name">Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="address">Address:&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="zipCode">Zip Code:&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="zipCode" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="phone">Phone:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="email">Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle} 
                />
                <br />
                <label htmlFor="message">Message:&nbsp;&nbsp;</label>
                <textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ ...inputStyle, height: '50px' ,overflowX: 'auto', overflowY: 'auto', }} 
                />
                <br />
                <button onClick={handleContactUs} style={buttonStyle}>Send Message</button>&nbsp;
                <button onClick={handleReset} style={buttonStyle}>Reset</button>
                {showFailureMessage && <p>Failed to send message.</p>}
                {successMessage && <p>{successMessage}</p>}
            </div>
            <br></br><br></br><br></br><br></br>
            <footer>
        <p>© 2024 StockWise. All rights reserved.</p>
      </footer>
        </div>
    );
};

export default ContactUs;
