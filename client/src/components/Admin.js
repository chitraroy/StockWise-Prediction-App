import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image


const Admin = () => {
    const [customerId, setCustomerId] = useState('');
    const [customerInfo, setCustomerInfo] = useState(null);
    const [showFailureMessage, setShowFailureMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailSuccessMessage, setEmailSuccessMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
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

    const containerStyle1 = {
        maxWidth: '400px',
        margin: '20px auto',
        padding: '20px',
        background: 'linear-gradient(to right, #223a5e, #424242)',
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

    const handleLogoff = () => {
        navigate('/');
        window.location.reload();
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/admin/customer/${customerId}`);
            if (response.data.customerInfo) {
                setCustomerInfo(response.data.customerInfo);
                setShowFailureMessage(false);
            } else {
                setCustomerInfo(null);
                setShowFailureMessage(true);
            }
        } catch (error) {
            console.error('Error fetching customer info:', error);
            setCustomerInfo(null);
            setShowFailureMessage(true);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/admin/customer/${customerId}`, customerInfo);
            if (response.status === 200) {
                console.log('Customer updated successfully:', response.data);
                setSuccessMessage('Customer updated successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    setCustomerInfo(null);
                    setCustomerId('');
                }, 2000); // Reset after 2 seconds
            } else {
                console.error('Error updating customer. Status:', response.status);
                setSuccessMessage('Error updating customer. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            setSuccessMessage('Error updating customer. Please try again later.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/admin/customer/${customerId}`);
            if (response.status === 200) {
                console.log('Customer deleted successfully:', response.data);
                setSuccessMessage('Customer deleted successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    setCustomerInfo(null);
                    setCustomerId('');
                }, 2000); // Reset after 2 seconds
            } else {
                console.error('Error deleting customer. Status:', response.status);
                setSuccessMessage('Error deleting customer. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            setSuccessMessage('Error deleting customer. Please try again later.');
        }
    };

    const handleInputChange = (fieldName, value) => {
        setCustomerInfo(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const sendEmail = async () => {
        try {
            // Make a POST request to the server to send email
            const response = await axios.post(`http://localhost:5000/admin/send_email/${customerId}`, {
                recipient_email: customerInfo.email, // Use customer email fetched earlier
                subject: "Information you requested for our product",
                message_body: emailMessage
            });
    
            if (response.status === 200) {
                console.log('Email sent successfully:', response.data);
                setSuccessMessage('Email sent successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    setCustomerInfo(null);
                    setCustomerId('');
                    setEmailMessage(''); 
                }, 2000); // Reset after 2 seconds
            } else {
                
                setEmailSuccessMessage(response.data.message);
                setEmailErrorMessage('');
            }
        } catch (error) {
            // If there's an error sending email, display error message
            setEmailSuccessMessage('');
            setEmailErrorMessage('Error sending email. Please try again later.');
            console.error('Error sending email:', error);
        }
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
                <h1>Hello Admin !!</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter Customer ID"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleSearch} style={buttonStyle}>Search</button>
                </div>
                <div style={containerStyle1}>
                    {customerInfo && (
                        <div style={{ marginTop: '20px' }}>
                            <h2>Customer Information</h2>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.customer_name || ''}
                                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Address: &nbsp;&nbsp;&nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.address || ''}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Zip Code: &nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.zip_code || ''}
                                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Phone: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Email: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Message: &nbsp;</label>
                                <input
                                    type="text"
                                    value={customerInfo.message || ''}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                />
                            </div>
                            <button onClick={handleUpdate} style={{ ...buttonStyle, marginRight: '10px' }}>Update</button>
                            <button onClick={handleDelete} style={buttonStyle}>Delete</button>
                        </div>
                    )}
                    {showFailureMessage && <p>Customer not found or an error occurred.</p>}
                    {successMessage && <p>{successMessage}</p>}
                </div>
                <div style={containerStyle1}>
                    <h2>Send Email</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Email Message: &nbsp;</label>
                        <input
                            type="text"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                        />
                    </div>
                    <button onClick={sendEmail} style={{ ...buttonStyle, background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}>Send Email</button>
                    {emailSuccessMessage && <p>{emailSuccessMessage}</p>}
                    {emailErrorMessage && <p>{emailErrorMessage}</p>}
                </div>
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <footer>
        <p>© 2024 StockWise. All rights reserved.</p>
      </footer>
        </div>
    );
};

export default Admin;
