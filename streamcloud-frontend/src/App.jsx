import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import WatchNowPage from './components/WatchNowPage';
import BrowseMoviesPage from './components/BrowseMoviesPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AccountPage from './components/AccountPage';
import KidsPage from './components/KidsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(Boolean(loggedInStatus));

    // Redirect based on login status
    if (loggedInStatus) {
      if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password') {
        navigate('/');
      }
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isLoggedIn ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/watchnow" element={<WatchNowPage />} />
        <Route path="/movies/genre/:genre" element={<BrowseMoviesPage />} />
        <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/kids" element={<KidsPage />} />
      </Routes>
    </>
  );
}

export default App;
