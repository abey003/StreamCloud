import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import WatchNowPage from './components/WatchNowPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/watchnow" element={<WatchNowPage />} />
    </Routes>
    </>
  )
}

export default App
