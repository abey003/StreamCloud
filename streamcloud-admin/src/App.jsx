import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import WatchNowPage from './components/WatchNowPage';
import AddMovies from './components/AddMovies';
import AddKidsShow from './components/AddKidsShow';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watchnow" element={<WatchNowPage />} />
        <Route path="/addmovie" element={<AddMovies />} />
        <Route path="/addkidsshow" element={<AddKidsShow />} />
      </Routes>
    </>
  );
}

export default App;
