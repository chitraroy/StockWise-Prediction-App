import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image

const Dashboard = () => {
    const [stockSymbol, setStockSymbol] = useState('');
    const [message, setMessage] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [futureDates, setFutureDates] = useState([]);
    const [dates, setDates] = useState([]);
    const [baselineClose, setBaselineClose] = useState([]);
    const navigate = useNavigate();

    const containerStyle = {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        color: '#333',
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

    const handlePredict = async () => {
        try {
            console.log('Sending POST request to /dashboard');
            const response = await axios.post('http://localhost:5000/dashboard', {
                stockSymbol,
            });

            const responseData = response.data;
            console.log('Server Response:', responseData);
            setMessage(responseData.message);
            setBaselineClose(responseData.baseline_close);
            setPredictions(responseData.predictions);
            setFutureDates(responseData.future_dates.map(date => new Date(date).toISOString().split('T')[0]));

            if (Array.isArray(responseData.dates)) {
                if (responseData.dates.length > 0) {
                    setDates(responseData.dates.map(date => new Date(date).toISOString().split('T')[0]));
                } else {
                    setDates([]);
                }
            } else {
                setDates([]);
            }

        } catch (error) {
            console.error('Prediction failed:', error);
        }
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
                <h3>Predict Stock Prices</h3>
                <label htmlFor="stockSymbol">Stock Symbol:&nbsp;</label>
                <input
                    type="text"
                    id="stockSymbol"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                    style={inputStyle}
                />&nbsp;&nbsp;
                <button onClick={handlePredict} style={buttonStyle}>Predict</button>
                {message && <div style={{ color: 'red', marginBottom: '10px' }}>{message}</div>}
                <div>
                    {/* Plotting */}
                    <Plot
                        data={[
                            {
                                x: dates,
                                y: baselineClose,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Actual Data',
                                marker: { color: 'blue' },
                            },
                            {
                                x: futureDates,
                                y: predictions,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Predicted Data',
                                line: { dash: 'dash', color: 'red' },
                            },
                        ]}
                        layout={{
                            title: 'Stock Price Prediction Line plot',
                            xaxis: {
                                title: 'Date',
                                tickformat: '%Y-%m-%d',
                                tickangle: 45,
                                dtick: 'M36', // Display ticks every 1 year
                            },
                            yaxis: {
                                title: 'Stock Price',
                            },
                            legend: {
                                x: 0,
                                y: 1,
                                traceorder: 'normal',
                                font: {
                                    family: 'sans-serif',
                                    size: 12,
                                    color: '#000'
                                },
                                bgcolor: '#E2E2E2',
                                bordercolor: '#FFFFFF',
                                borderwidth: 2
                            }
                        }}
                    />

                    {/* Plotting Bar Chart */}
                    <Plot
                        data={[
                            {
                                x: dates,
                                y: baselineClose,
                                type: 'bar',
                                name: 'Actual Data',
                                marker: { color: 'blue' },
                            },
                            {
                                x: futureDates,
                                y: predictions,
                                type: 'bar',
                                name: 'Predicted Data',
                                marker: { color: 'red' },
                            },
                        ]}
                        layout={{
                            title: 'Stock Price Prediction Bar Plot',
                            xaxis: {
                                title: 'Date',
                                tickformat: '%Y-%m-%d',
                                tickangle: 45,
                                dtick: 'M36', // Display ticks every 1 year
                            },
                            yaxis: {
                                title: 'Stock Price',
                            },
                            legend: {
                                x: 0,
                                y: 1,
                                traceorder: 'normal',
                                font: {
                                    family: 'sans-serif',
                                    size: 12,
                                    color: '#000'
                                },
                                bgcolor: '#E2E2E2',
                                bordercolor: '#FFFFFF',
                                borderwidth: 2
                            }
                        }}
                    />
                </div>
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <footer>
                <p>© 2024 StockWise. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
