import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaThayThe() {
  const [inputText, setInputText] = useState('');
  const [substitutionAlphabet, setSubstitutionAlphabet] = useState('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [outputText, setOutputText] = useState('');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const substitutionCipher = (text, substitutionAlphabet) => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        const index = alphabet.indexOf(char);
        return index !== -1 ? substitutionAlphabet[index] : char;
      })
      .join('');
  };

  const reverseSubstitutionCipher = (text, substitutionAlphabet) => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        const index = substitutionAlphabet.indexOf(char);
        return index !== -1 ? alphabet[index] : char;
      })
      .join('');
  };

  const handleEncrypt = () => {
    const result = substitutionCipher(inputText, substitutionAlphabet);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = reverseSubstitutionCipher(inputText, substitutionAlphabet);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Thay Thế Đơn Bản</h2>
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
            <label>Nhập bảng chữ cái thay thế (26 ký tự):</label>
            <input
              type="text"
              value={substitutionAlphabet}
              onChange={(e) => setSubstitutionAlphabet(e.target.value.toUpperCase())}
              className="form-control"
              maxLength={26} 
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

export default MaHoaThayThe;
