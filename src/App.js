import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MaHoaCaesar from './components/MaHoaCaesar';
import MaHoaThayThe from './components/MaHoaThayThe';


function App() {
  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center">Hệ Thống Mã Hóa</h1>
        <nav className="text-center mb-4">
          <Link to="/caesar" className="btn btn-primary me-2">Bài 1: Mã Hóa Caesar</Link>
          <Link to="/substitution" className="btn btn-primary">Bài 2: Mã Hóa Thay Thế</Link>
        </nav>

        <Routes>
          <Route path="/caesar" element={<MaHoaCaesar />} />
          <Route path="/substitution" element={<MaHoaThayThe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
