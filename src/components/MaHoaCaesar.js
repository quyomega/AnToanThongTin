import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaCaesar() {
  const [inputText, setInputText] = useState('');
  const [shift, setShift] = useState(0);
  const [outputText, setOutputText] = useState('');

  const caesarCipher = (text, shift, decode = false) => {
    if (decode) {
      shift = (26 - shift) % 26;
    }

    return text
      .split('')
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const base = char.charCodeAt(0) < 97 ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  const handleEncrypt = () => {
    const result = caesarCipher(inputText, parseInt(shift));
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = caesarCipher(inputText, parseInt(shift), true);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Caesar</h2>
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
            <label>Nhập giá trị khóa k :</label>
            <input
              type="number"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
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

export default MaHoaCaesar;