import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import VirtualTryOn from './pages/VirtualTryOn';
import Login from './pages/Login';
import Register from './pages/Register';
import Wardrobe from './pages/Wardrobe';
import ColorAnalysis from './pages/ColorAnalysis';
import StyleConsultant from './pages/StyleConsultant';
import OutfitStudio from './pages/OutfitStudio';
import OutfitAnalyzer from './pages/OutfitAnalyzer';
import Pricing from './pages/Pricing';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/try-on" element={<VirtualTryOn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/wardrobe"
            element={
              <ProtectedRoute>
                <Wardrobe />
              </ProtectedRoute>
            }
          />
          <Route path="/color-analysis" element={<ColorAnalysis />} />
          <Route
            path="/consultation"
            element={
              <ProtectedRoute>
                <StyleConsultant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <OutfitStudio />
              </ProtectedRoute>
            }
          />
          <Route path="/analyzer" element={<OutfitAnalyzer />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
