import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(''); // New state for role
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
        try {
            const response = await axios.post('http://localhost:5000/signin', {
                name,
                password,
                phone,
                email,
                role // Include role in the request
            });

            if (response.data.message === 'Signin success') {
                setShowFailureMessage(false);
                setSuccessMessage('User inserted successfully.');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else if (response.data.message === 'User existing') {
                setShowFailureMessage(true);
                setSuccessMessage('User already exists.');
                setName('');
                setPassword('');
                setPhone('');
                setEmail('');
                setRole(''); // Reset role field on failure
            }
        } catch (error) {
            setShowFailureMessage(true);
            setName('');
            setPassword('');
            setPhone('');
            setEmail('');
            setRole('');
            console.error('Signin failed:', error);
        }
    };

    const handleReset = () => {
        setName('');
        setPassword('');
        setPhone('');
        setEmail('');
        setRole('');
    };

    return (
        <div>
            <header className="banner">
                <div className="logo">
                    <img src="your_logo_image_path_here" alt="Logo" />
                </div>
                <div className="tagline">
                    <h2>Empowering Financial Decisions with AI</h2>
                </div>
                <nav>
                    <ul>
                    <li><Link to="/">Home</Link></li> {/* Change anchor tag to Link */}
                    <li><Link to="/login">Login</Link></li> {/* Change anchor tag to Link */}
                    <li><Link to="/signup">Signup</Link></li> {/* Add Signin link */}
                    <li><Link to="/contactus">ContactUs</Link></li> {/* Add Signin link */}
                    </ul>
                </nav>
            </header>
            <div style={containerStyle}>
                <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Signup Form</h3>
                <label htmlFor="name">Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
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
                <label htmlFor="phone">Phone:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle} 
                /> <br></br>
                <label htmlFor="email">Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                   
                    style={inputStyle} 
                /> <br></br>
                <label htmlFor="role">Role:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> {/* New role field */}
                <input 
                    type="text" 
                    id="role" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={inputStyle} 
                /> <br></br>
                <button onClick={handleSignin} style={buttonStyle}>Signup</button>&nbsp;
                <button onClick={handleReset} style={buttonStyle}>Reset</button>
                {showFailureMessage && <p>Signin failed. User Existing !!.</p>}
                {successMessage && <p>{successMessage}</p>}
            </div>
        </div>
    );
};

export default Signin;
