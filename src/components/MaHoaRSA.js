import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';

function MaHoaRSA() {
  const [inputText, setInputText] = useState('');
  const [signedText, setSignedText] = useState('');
  const [verifiedText, setVerifiedText] = useState('');
  const [inputVerificationText, setInputVerificationText] = useState('');
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  const [e, setE] = useState(0);
  const [pendingE, setPendingE] = useState(0); // Giá trị tạm thời của e
  const [publicKey, setPublicKey] = useState({ e: 0, n: 0 });
  const [privateKey, setPrivateKey] = useState({ d: 0, n: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSign, setShowSign] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  // Hàm debounce cập nhật e sau 1 giây
  const updateE = useCallback(
    debounce((value) => {
      setE(value);
    }, 1000),
    []
  );

  const handleEChange = (value) => {
    setPendingE(value);
    updateE(value);
  };

  // Kiểm tra số nguyên tố
  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Sinh số nguyên tố ngẫu nhiên
  const generateRandomPrime = () => {
    let prime = Math.floor(Math.random() * 100) + 2;
    while (!isPrime(prime)) {
      prime = Math.floor(Math.random() * 100) + 2;
    }
    return prime;
  };

  // Sinh khóa
  const generateKeys = () => {
    const newP = p || generateRandomPrime();
    const newQ = q || generateRandomPrime();
  
    if (!isPrime(newP) || !isPrime(newQ)) {
      setErrorMessage('p và q phải là số nguyên tố.');
      toast.error('p và q phải là số nguyên tố.');
      return;
    }
  
    const n = newP * newQ;
    const phi = (newP - 1) * (newQ - 1);
  
    let defaultE = e || 3;
  
    // Kiểm tra nếu gcd(e, phi) không phải là 1 hoặc e không hợp lệ
    if (gcd(defaultE, phi) !== 1 || defaultE <= 1 || defaultE >= phi) {
      defaultE = 13;
      setErrorMessage(`e không hợp lệ. Đã tự động chọn e = ${defaultE}`);
      toast.error(`e không hợp lệ. Đã tự động chọn e = ${defaultE}`);
    }
  
    const d = modInverse(defaultE, phi);
  
    setPublicKey({ e: defaultE, n });
    setPrivateKey({ d, n });
    setP(newP);
    setQ(newQ);
    setE(defaultE);
    toast.success('Khóa đã được tạo thành công!');
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

  const modExp = (base, exp, mod) => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const rsaEncrypt = (text, e, n) => {
    const chars = text.split('').map((char) => char.charCodeAt(0));
    const encryptedChars = chars.map((charCode) => {
      if (charCode >= n) {
        setErrorMessage('Ký tự có mã ASCII lớn hơn n không thể mã hóa!');
        toast.error('Ký tự có mã ASCII lớn hơn n không thể mã hóa!');
        return;
      }
      return modExp(charCode, e, n);
    }).filter(Boolean);

    return encryptedChars.join(' ');
  };

  const rsaDecrypt = (encryptedText, d, n) => {
    const encryptedChars = encryptedText.split(' ').map((num) => parseInt(num));
    const decryptedChars = encryptedChars.map((charCode) => {
      const decryptedChar = modExp(charCode, d, n);
      if (decryptedChar < 32 || decryptedChar > 126) {
        setErrorMessage('Kết quả giải mã không hợp lệ (ký tự không hợp lệ).');
        toast.error('Kết quả giải mã không hợp lệ (ký tự không hợp lệ).');
        return;
      }
      return String.fromCharCode(decryptedChar);
    });
    return decryptedChars.join('');
  };

  const handleSign = () => {
    if (!inputText) {
      setErrorMessage('Vui lòng nhập văn bản để ký.');
      toast.error('Vui lòng nhập văn bản để ký.');
      return;
    }
    setErrorMessage('');
    const signed = rsaEncrypt(inputText, publicKey.e, publicKey.n);
    setSignedText(signed);
    toast.success('Đã ký thành công!');
  };

  const handleVerify = () => {
    if (!inputVerificationText) {
      setErrorMessage('Vui lòng nhập văn bản cần xác thực.');
      toast.error('Vui lòng nhập văn bản cần xác thực.');
      return;
    }
    setErrorMessage('');
    const verified = rsaDecrypt(inputVerificationText, privateKey.d, privateKey.n);
    setVerifiedText(verified);
    toast.success('Xác thực thành công!');
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa RSA</h2>

      <div className="mb-4">
        <button onClick={generateKeys} className="btn btn-success mb-3">
          Sinh Khóa
        </button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div className="mt-3">
          <p>Khóa công khai (e, n): ({publicKey.e.toString()}, {publicKey.n.toString()})</p>
          <p>Khóa riêng tư (d, n): ({privateKey.d.toString()}, {privateKey.n.toString()})</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="inputP" className="form-label">Nhập giá trị p:</label>
        <input
          type="number"
          id="inputP"
          className="form-control"
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
        />
        <label htmlFor="inputQ" className="form-label">Nhập giá trị q:</label>
        <input
          type="number"
          id="inputQ"
          className="form-control"
          value={q}
          onChange={(e) => setQ(Number(e.target.value))}
        />
        <label htmlFor="inputE" className="form-label">Nhập giá trị e:</label>
        <input
          type="number"
          id="inputE"
          className="form-control"
          value={pendingE} // Dùng giá trị tạm thời cho e
          onChange={(e) => handleEChange(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <button
          onClick={() => {
            setShowSign(true);
            setShowVerify(false);
          }}
          className="btn btn-primary mx-2"
        >
          Ký Văn Bản
        </button>
        <button
          onClick={() => {
            setShowSign(false);
            setShowVerify(true);
          }}
          className="btn btn-secondary mx-2"
        >
          Xác Thực
        </button>
      </div>

      {showSign && (
        <div className="mb-4">
          <label htmlFor="inputText" className="form-label">Văn bản cần ký:</label>
          <textarea
            id="inputText"
            className="form-control"
            rows="3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button onClick={handleSign} className="btn btn-success mt-2">Ký</button>
          {signedText && <p className="mt-3">Văn bản đã ký: {signedText}</p>}
        </div>
      )}

      {showVerify && (
        <div className="mb-4">
          <label htmlFor="inputVerificationText" className="form-label"></label>
          <textarea
            id="inputVerificationText"
            className="form-control"
            rows="3"
            value={inputVerificationText}
            onChange={(e) => setInputVerificationText(e.target.value)}
          />
          <button onClick={handleVerify} className="btn btn-secondary mt-2">Xác Thực</button>
          {verifiedText && <p className="mt-3"> {verifiedText}</p>}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default MaHoaRSA;
