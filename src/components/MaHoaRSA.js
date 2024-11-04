import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaRSA() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  const [e, setE] = useState(0);
  const [publicKey, setPublicKey] = useState({ e: 0, n: 0 });
  const [privateKey, setPrivateKey] = useState({ d: 0, n: 0 });
  const [errorMessage, setErrorMessage] = useState('');

  const isPrime = (num) => {
    if (num < 2) return false; 
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const generateKeys = () => {
    if (!isPrime(p) || !isPrime(q)) {
      setErrorMessage('p và q phải là số nguyên tố.');
      return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Kiểm tra tính hợp lệ của e
    if (gcd(e, phi) !== 1 || e <= 1 || e >= phi) {
      setErrorMessage('Giá trị e phải là số nguyên tố và coprime với phi.');
      return;
    }

    const d = modInverse(e, phi);

    setPublicKey({ e, n });
    setPrivateKey({ d, n });
    setErrorMessage('');
  };

  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const modInverse = (a, m) => {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;
    if (m === 1) return 0;
    while (a > 1) {
      q = Math.floor(a / m);
      t = m;
      m = a % m;
      a = t;
      t = x0;
      x0 = x1 - q * x0;
      x1 = t;
    }
    if (x1 < 0) x1 += m0;
    return x1;
  };

  const rsaEncrypt = (text, e, n) => {
    const chars = text.split('').map((char) => char.charCodeAt(0));
    const encryptedChars = chars.map((charCode) => (Math.pow(charCode, e) % n));
    return encryptedChars.join(' ');
  };

  const rsaDecrypt = (encryptedText, d, n) => {
    const encryptedChars = encryptedText.split(' ').map((num) => parseInt(num));
    const decryptedChars = encryptedChars.map((charCode) => String.fromCharCode(Math.pow(charCode, d) % n));
    return decryptedChars.join('');
  };

  const handleEncrypt = () => {
    if (!inputText) {
      setErrorMessage('Vui lòng nhập văn bản để mã hóa.');
      return;
    }
    setErrorMessage('');
    const normalizedInputText = inputText.toLowerCase(); // Chuyển đổi thành chữ thường
    const encrypted = rsaEncrypt(normalizedInputText, publicKey.e, publicKey.n);
    setOutputText(encrypted);
  };

  const handleDecrypt = () => {
    if (!outputText) {
      setErrorMessage('Vui lòng mã hóa văn bản trước khi giải mã.');
      return;
    }
    setErrorMessage('');
    const decrypted = rsaDecrypt(outputText, privateKey.d, privateKey.n);
    setInputText(decrypted); // Cập nhật văn bản đã giải mã vào inputText
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa RSA</h2>

      <div className="mb-4">
        <h3>Nhập p:</h3>
        <input
          type="number"
          onChange={(e) => setP(Number(e.target.value))}
          className="form-control"
        />
      </div>

      <div className="mb-4">
        <h3>Nhập q:</h3>
        <input
          type="number"
          onChange={(e) => setQ(Number(e.target.value))}
          className="form-control"
        />
      </div>

      <div className="mb-4">
        <h3>Nhập e (khóa công khai):</h3>
        <input
          type="number"
          value={e}
          onChange={(e) => setE(Number(e.target.value))}
          className="form-control"
        />
      </div>

      <div className="text-center mb-4">
        <button onClick={generateKeys} className="btn btn-success">
          Tạo Khóa
        </button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <div className="mt-3">
          <p>Khóa công khai (e, n): ({publicKey.e.toString()}, {publicKey.n.toString()})</p>
          <p>Khóa riêng tư (d, n): ({privateKey.d.toString()}, {privateKey.n.toString()})</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3>Văn Bản:</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="form-control"
            rows="8"
          />
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

      <div className="text-center mt-4">
        <button onClick={handleEncrypt} className="btn btn-primary me-2">
          Mã Hóa
        </button>
        <button onClick={handleDecrypt} className="btn btn-secondary">
          Giải Mã
        </button>
      </div>
    </div>
  );
}

export default MaHoaRSA;
