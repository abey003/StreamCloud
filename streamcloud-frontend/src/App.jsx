import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import WatchNowPage from './components/WatchNowPage';
import BrowseMoviesPage from './components/BrowseMoviesPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage'; // Import the ForgotPasswordPage
import ResetPasswordPage from './components/ResetPasswordPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
  
    // Only redirect if the user is not logged in and is not on the login/signup/forgot-password page
    if (!loggedInStatus && !['/login', '/signup', '/forgot-password'].includes(window.location.pathname)) {
      navigate('/login');
    } else {
      // Set the logged-in status based on localStorage
      setIsLoggedIn(Boolean(loggedInStatus));
    }
  }, [navigate]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watchnow" element={<WatchNowPage />} />
        <Route path="/movies/genre/:genre" element={<BrowseMoviesPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Add forgot password route */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
