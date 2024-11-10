import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MaHoaRSA() {
  const [inputText, setInputText] = useState('');
  const [signedText, setSignedText] = useState('');
  const [verifiedText, setVerifiedText] = useState('');
  const [inputVerificationText, setInputVerificationText] = useState('');
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  const [e, setE] = useState(0);
  const [publicKey, setPublicKey] = useState({ e: 0, n: 0 });
  const [privateKey, setPrivateKey] = useState({ d: 0, n: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSign, setShowSign] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const generateRandomPrime = () => {
    let prime = Math.floor(Math.random() * 100) + 2;
    while (!isPrime(prime)) {
      prime = Math.floor(Math.random() * 100) + 2;
    }
    return prime;
  };
  //sinh khóa
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
      // Thông báo người dùng nếu giá trị e không hợp lệ
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

  useEffect(() => {
    if (p && q && e) {  // Kiểm tra nếu p, q và e đều có giá trị
      generateKeys();
    }
  }, [p, q, e]); // Gọi lại generateKeys mỗi khi p, q, hoặc e thay đổi

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
          value={e}
          onChange={(e) => setE(Number(e.target.value))}
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
            setShowVerify(true);
            setShowSign(false);
          }}
          className="btn btn-primary mx-2"
        >
          Xác Thực Văn Bản
        </button>
      </div>

      {showSign && (
        <div className="mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="form-control"
            placeholder="Nhập văn bản để ký"
          />
          <button onClick={handleSign} className="btn btn-primary mt-3">
            Ký
          </button>
          <div className="mt-3">
            <h5>Văn bản đã ký:</h5>
            <p>{signedText}</p>
          </div>
        </div>
      )}

      {showVerify && (
        <div className="mb-4">
          <textarea
            value={inputVerificationText}
            onChange={(e) => setInputVerificationText(e.target.value)}
            className="form-control"
            placeholder="Nhập văn bản cần xác thực"
          />
          <button onClick={handleVerify} className="btn btn-primary mt-3">
            Xác Thực
          </button>
          <div className="mt-3">
            <h5>Kết quả xác thực:</h5>
            <p>{verifiedText}</p>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default MaHoaRSA;
