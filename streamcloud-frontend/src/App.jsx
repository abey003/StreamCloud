import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import WatchNowPage from './components/WatchNowPage'
import BrowseMoviesPage from './components/BrowseMoviesPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/watchnow" element={<WatchNowPage />} />
      <Route path="/movies/genre/:genre" element={<BrowseMoviesPage />} />
    </Routes>
    </>
  )
}

export default App
