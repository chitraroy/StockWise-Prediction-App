import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import ContactUs from './components/contactus';
import Signup from './components/Signup';
import Admin from './components/Admin'; // Import the new Admin component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} /> {/* Add the route for Admin */}
      </Routes>
    </Router>
  );
}

export default App;
