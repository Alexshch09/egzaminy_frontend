// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken, clearTokens } from '../utils/tokenUtils';

const Header = () => {
  const navigate = useNavigate();
  const token = getAccessToken();
  const userId = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
      <Link to="/"><h1 className="text-xl font-bold">INF.03</h1></Link>
        <nav>
          {userId ? (
            <div className="flex items-center space-x-4">
              {/* <span className="text-lg">User ID: {userId}</span> */}
              <Link to="/test" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Test</Link>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Login</Link>
              <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
