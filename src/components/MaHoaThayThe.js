import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaThayThe() {
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [outputText, setOutputText] = useState('');

  const substitutionCipher = (text, key, decode = false) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const mappedKey = key.toLowerCase().split('');

    return text
      .split('')
      .map((char) => {
        const lowerChar = char.toLowerCase();
        const index = alphabet.indexOf(lowerChar);
        if (index !== -1) {
          const newChar = decode ? alphabet[index] : mappedKey[index];
          return char === lowerChar ? newChar : newChar.toUpperCase();
        }
        return char;
      })
      .join('');
  };

  const handleEncrypt = () => {
    const result = substitutionCipher(inputText, key);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = substitutionCipher(inputText, key, true);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Thay Thế</h2>
      <div className="mb-3">
        <label>Nhập văn bản:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Nhập khóa thay thế (26 ký tự):</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="form-control"
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

      <div className="mb-3">
        <h3>Kết quả:</h3>
        <textarea
          readOnly
          value={outputText}
          className="form-control"
          rows="5"
        />
      </div>
    </div>
  );
}

export default MaHoaThayThe;
