import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaHoanVi() {
  const [inputText, setInputText] = useState('');
  const [numColumns, setNumColumns] = useState(4); 
  const [outputText, setOutputText] = useState('');

  const hoanViEncrypt = (text, numColumns) => {
    const rows = Math.ceil(text.length / numColumns);
    let grid = Array.from({ length: rows }, () => new Array(numColumns).fill(''));
    
    for (let i = 0; i < text.length; i++) {
      const row = Math.floor(i / numColumns);
      const col = i % numColumns;
      grid[row][col] = text[i];
    }

    let encryptedText = '';
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < rows; row++) {
        if (grid[row][col]) {
          encryptedText += grid[row][col];
        }
      }
    }

    return encryptedText;
  };

  const hoanViDecrypt = (text, numColumns) => {
    const rows = Math.ceil(text.length / numColumns);
    let grid = Array.from({ length: rows }, () => new Array(numColumns).fill(''));
    
    let index = 0;

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < rows; row++) {
        if (index < text.length) {
          grid[row][col] = text[index];
          index++;
        }
      }
    }

    let decryptedText = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < numColumns; col++) {
        if (grid[row][col]) {
          decryptedText += grid[row][col];
        }
      }
    }

    return decryptedText;
  };

  const handleEncrypt = () => {
    const result = hoanViEncrypt(inputText, parseInt(numColumns));
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = hoanViDecrypt(inputText, parseInt(numColumns));
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hoán Vị</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h3>Bản Rõ:</h3>
            <label>Nhập bản rõ:</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Nhập số cột (kích thước lưới):</label>
            <input
              type="number"
              value={numColumns}
              onChange={(e) => setNumColumns(e.target.value)}
              className="form-control"
              min={2} 
            />
          </div>

          <div className="text-center mb-4">
            <button onClick={handleEncrypt} className="btn btn-primary me-2">
              Mã Hóa
            </button>
            <button onClick={handleDecrypt} className="btn btn-secondary">
              Giải Mã
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h3>Bản Mã:</h3>
          <textarea
            readOnly
            value={outputText}
            className="form-control"
            rows="8"
          />
        </div>
      </div>
    </div>
  );
}

export default MaHoaHoanVi;
