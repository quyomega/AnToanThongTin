import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaCaesar() {
  const [inputText, setInputText] = useState('');
  const [k, setk] = useState(0);
  const [outputText, setOutputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [kErrorMessage, setkErrorMessage] = useState('');

  const caesar = (text, k, decode = false) => {
    if (decode) {
      k = (26 - k) % 26;
    }

    return text
      .split('')
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const base = char.charCodeAt(0) < 97 ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - base + k) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  const maHoa = () => {
    const result = caesar(inputText, parseInt(k));
    setOutputText(result);
  };

  const giaiMa = () => {
    const result = caesar(inputText, parseInt(k), true);
    setOutputText(result);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z]+$/;

    if (value === '' || regex.test(value)) {
      setInputText(value);
      setErrorMessage('');
    } else {
      setErrorMessage('Chỉ được nhập chữ cái không dấu.');
    }
  };

  const handlekChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 0 || value >= 26 || isNaN(value)) {
      setkErrorMessage('Giá trị khóa k phải nằm trong khoảng từ 0 đến 25.');
    } else {
      setkErrorMessage('');
      setk(value);
    }
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
              onChange={handleInputChange}
              className="form-control"
            />
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </div>

          <div className="mb-3">
            <label>Nhập giá trị khóa k :</label>
            <input
              type="number"
              value={k}
              onChange={handlekChange}
              className="form-control"
              min="0" 
              max="25"
            />
            {kErrorMessage && <p className="text-danger">{kErrorMessage}</p>}
          </div>

          <div className="text-center mb-4">
            <button 
              onClick={maHoa} 
              className="btn btn-primary me-2" 
              disabled={errorMessage || kErrorMessage}>
              Mã Hóa
            </button>
            <button 
              onClick={giaiMa} 
              className="btn btn-secondary" 
              disabled={errorMessage || kErrorMessage}>
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
