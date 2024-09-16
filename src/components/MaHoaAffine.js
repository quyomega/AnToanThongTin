import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaAffine() {
  const [inputText, setInputText] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [outputText, setOutputText] = useState('');

  const affineEncrypt = (text, a, b) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const m = alphabet.length;
    const gcd = (x, y) => {
      while (y !== 0) {
        const temp = y;
        y = x % y;
        x = temp;
      }
      return x;
    };

    if (gcd(a, m) !== 1) {
      return "a và b phải là 2 số nguyên tố cùng nhau";
    }

    let encryptedText = '';

    for (let char of text.toUpperCase()) {
      if (alphabet.includes(char)) {
        const x = alphabet.indexOf(char);
        const encryptedCharIndex = (a * x + b) % m;
        encryptedText += alphabet[encryptedCharIndex];
      } else {
        encryptedText += char; 
      }
    }

    return encryptedText;
  };

  const affineDecrypt = (text, a, b) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const m = alphabet.length;

    const modInverse = (a, m) => {
      let [m0, x0, x1] = [m, 0, 1];
      if (m === 1) return 0;
      while (a > 1) {
        const q = Math.floor(a / m);
        [m, a] = [a % m, m];
        [x0, x1] = [x1 - q * x0, x0];
      }
      return x1 < 0 ? x1 + m0 : x1;
    };

    const aInv = modInverse(a, m);
    let decryptedText = '';

    for (let char of text.toUpperCase()) {
      if (alphabet.includes(char)) {
        const x = alphabet.indexOf(char);
        const decryptedCharIndex = (aInv * (x - b) + m) % m;
        decryptedText += alphabet[decryptedCharIndex];
      } else {
        decryptedText += char;
      }
    }

    return decryptedText;
  };

  const handleEncrypt = () => {
    const result = affineEncrypt(inputText, a, b);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = affineDecrypt(inputText, a, b);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Affine</h2>
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
          <label>Nhập từ khóa:</label>
            <div className="row">
              <div className="col-md-6 d-flex align-items-center">
                <label htmlFor="a" className="me-2">a:</label>
                <input
                  id="a"
                  type="number"
                  value={a}
                  onChange={(e) => setA(parseInt(e.target.value, 10))}
                  className="form-control"
                  style={{ width: 'auto' }}
                />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <label htmlFor="b" className="me-2">b:</label>
                <input
                  id="b"
                  type="number"
                  value={b}
                  onChange={(e) => setB(parseInt(e.target.value, 10))}
                  className="form-control"
                />
              </div>
            </div>
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

export default MaHoaAffine;