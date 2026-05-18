//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

//Import des pages
import Home from './views/Home';
import Collection from './views/Collection';
import Shop from './views/Shop';
import Profile from './views/Profile'

//Import des composants
import Navbar from "./components/Navbar";

function AppContent() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
