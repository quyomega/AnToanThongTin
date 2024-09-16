import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MaHoaCaesar from './components/MaHoaCaesar';
import MaHoaThayThe from './components/MaHoaThayThe';
import MaHoaHoanVi from './components/MaHoaHoanVi';
import MaHoaVigenere from './components/MaHoaVigenere';
import MaHoaAffine from './components/MaHoaAffine';  

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center">Hệ Thống Mã Hóa</h1>
        <nav className="text-center mb-4">
          <Link to="/mahoacaesar" className="btn btn-primary me-2">Bài 1: Mã Hóa Caesar</Link>
          <Link to="/mahoathaythe" className="btn btn-primary me-2">Bài 2: Mã Hóa Thay Thế</Link>
          <Link to="/mahoahoanvi" className="btn btn-primary me-2">Bài 3: Mã Hóa Hoán Vị</Link>
          <Link to="/mahoavigenere" className="btn btn-primary me-2">Bài 4: Mã Hóa Vigenere</Link>
          <Link to="/mahoaaffine" className="btn btn-primary">Bài 5: Mã Hóa Affine</Link>
        </nav>

        <Routes>
          <Route path="/mahoacaesar" element={<MaHoaCaesar />} />
          <Route path="/mahoathaythe" element={<MaHoaThayThe />} />
          <Route path="/mahoahoanvi" element={<MaHoaHoanVi />} />
          <Route path="/mahoavigenere" element={<MaHoaVigenere />} />
          <Route path="/mahoaaffine" element={<MaHoaAffine />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
