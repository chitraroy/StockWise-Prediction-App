import React from 'react';
import { Link } from 'react-router-dom';
import './Styles.css';
import logo from './logo.jpg';
import backgroundImage from './blue.jpg'; // Import the background image
import sr1 from './sr1.png'; // Import the image for Stock Prediction
import sr2 from './sr2.png'; // Import the image for Market Analysis

function Home() {
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
          </ul>
        </nav>
      </header>
      <main>
        <section className="vision-section">
          <h3>Our Vision:</h3>
          <p>
            At StockWise, we aim to revolutionize the way you make financial decisions.
            Our advanced AI models and precision research provide you with the insights you need to navigate the stock market confidently.
          </p>
        </section>
        <section className="mission-section">
  <h3>Why We Stand Out:</h3>
  <div className="mission-items">
    <div>
      <h4>Accurate Stock Predictions</h4>
      <p>Our trained data models, built after extensive research, enable us to provide accurate predictions of stock data.</p>
    </div>
    <div>
      <h4>Informed Investment Decisions</h4>
      <p>By using Stockwise, you can make informed investment decisions based on our reliable stock predictions.</p>
    </div>
    <div>
      <h4>Stay Ahead in the Market</h4>
      <p>With Stockwise, you can stay ahead in the market by leveraging our advanced technology to predict stock trends and make profitable moves.</p>
    </div>
  </div>
</section>
<section className="services-section">
  <h3>Services</h3> 
  <div className="service">
      <img src={sr1} alt="Stock Prediction" />
      <div>
        <h4>Stock Prediction</h4>
        <p>Our Stock Prediction service utilizes advanced data models built through extensive research to provide accurate and reliable predictions for stock market data. By analyzing historical data, market trends, and other relevant factors, we can help investors make informed decisions and maximize their returns. Whether you are an individual investor or a financial institution, our Stock Prediction service can assist you in making smarter investment choices.</p>
      </div>
   </div>

   <div className="service">
      <img src={sr2} alt="Market Analysis" />
      <div>
        <h4>Market Analysis</h4>
        <p>Our Market Analysis service offers comprehensive insights and reports on various financial markets. Our team of experts analyzes market trends, economic indicators, and other factors to provide detailed and up-to-date information. Whether you are looking to understand the current state of the stock market, explore new investment opportunities, or assess the performance of specific sectors, our Market Analysis service can provide you with valuable insights and help you make more informed investment decisions..</p>
      </div>
   </div>

</section>
<br></br>
<section className="pricing-section">
  <h3>Plans and Pricing</h3>
  <div className="pricing-items">
    <div className="pricing-item">
      <h4>Starter</h4>
      <p>$50/month</p>
      <ul>
        <li>Real-Time Data</li>
        <li>Basic Features</li>
        <li>User-Friendly Interface</li>
      </ul>
      <button>Buy starter now</button>
    </div>
    <div className="pricing-item">
      <h4>Professional</h4>
      <p>$200/month</p>
      <ul>
        <li>Customizable Alerts</li>
        <li>Advanced Analytics</li>
        <li>Technical Indicators</li>
      </ul>
      <button>Buy professional now</button>
    </div>
    <div className="pricing-item">
      <h4>Enterprise</h4>
      <p>$600/month</p>
      <ul>
        <li>API Integration</li>
        <li>24/7 Support</li>
        <li>Dedicated Account Manager</li>
      </ul>
      <button>Buy enterprise now</button>
    </div>
  </div>
</section>
      </main>
      <footer>
        <p>© 2024 StockWise. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
