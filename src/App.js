// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';
import MainPage from './components/MainPage'; // Import MainPage
import NotFoundPage from './components/NotFoundPage'; // Import NotFoundPage
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Main Page Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Protected />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 page */}
      </Routes>
    </Router>
  );
}

export default App;
