import React, { useState } from 'react';

function DiffieHellman() {
  const [prime, setPrime] = useState(23);        
  const [base, setBase] = useState(5);           
  const [privateKeyA, setPrivateKeyA] = useState(6); // Khóa riêng tư 
  const [privateKeyB, setPrivateKeyB] = useState(15); 
  const [publicKeyA, setPublicKeyA] = useState(0);   // Khóa công khai
  const [publicKeyB, setPublicKeyB] = useState(0);   
  const [sharedSecretA, setSharedSecretA] = useState(0); // Khóa bí mật
  const [sharedSecretB, setSharedSecretB] = useState(0); 
  const [errorMessage, setErrorMessage] = useState("");

  // Hàm tính luỹ thừa theo modulo
  const modExp = (base, exponent, mod) => {
    let result = 1;
    base = base % mod;
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % mod;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  // Hàm kiểm tra căn nguyên thủy
  const isPrimitiveRoot = (g, p) => {
    const remainders = new Set();
    for (let i = 1; i < p; i++) {
      const remainder = modExp(g, i, p);
      if (remainders.has(remainder)) {
        return false;
      }
      remainders.add(remainder);
    }
    return true;
  };

  // Hàm tính khóa công khai của A và B
  const generatePublicKeys = () => {
    if (!isPrimitiveRoot(base, prime)) {
      setErrorMessage("Cơ số g không phải là căn nguyên thủy của p. Vui lòng nhập lại.");
      return;
    }
    setErrorMessage("");
    const pubKeyA = modExp(base, privateKeyA, prime);
    const pubKeyB = modExp(base, privateKeyB, prime);
    setPublicKeyA(pubKeyA);
    setPublicKeyB(pubKeyB);
  };

  // Hàm tính khóa bí mật chung từ khóa công khai của đối phương
  const generateSharedSecrets = () => {
    const secretA = modExp(publicKeyB, privateKeyA, prime);
    const secretB = modExp(publicKeyA, privateKeyB, prime);
    setSharedSecretA(secretA);
    setSharedSecretB(secretB);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Diffie-Hellman</h2>

      <div className="mb-4">
        <label htmlFor="prime" className="form-label">Số nguyên tố p:</label>
        <input
          type="number"
          id="prime"
          className="form-control"
          value={prime}
          onChange={(e) => setPrime(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="base" className="form-label">Cơ số g:</label>
        <input
          type="number"
          id="base"
          className="form-control"
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="privateKeyA" className="form-label">Khóa riêng tư của A:</label>
        <input
          type="number"
          id="privateKeyA"
          className="form-control"
          value={privateKeyA}
          onChange={(e) => setPrivateKeyA(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="privateKeyB" className="form-label">Khóa riêng tư của B:</label>
        <input
          type="number"
          id="privateKeyB"
          className="form-control"
          value={privateKeyB}
          onChange={(e) => setPrivateKeyB(Number(e.target.value))}
        />
      </div>

      <button onClick={generatePublicKeys} className="btn btn-primary mb-4">
        Tạo Khóa Công Khai
      </button>

      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <div className="mt-3">
        <p>Khóa công khai của A : <strong>{publicKeyA}</strong></p>
        <p>Khóa công khai của B : <strong>{publicKeyB}</strong></p>
      </div>

      <button onClick={generateSharedSecrets} className="btn btn-success mt-4">
        Tạo Khóa Bí Mật Chung
      </button>

      <div className="mt-3">
        <p>Khóa bí mật chung của A: <strong>{sharedSecretA}</strong></p>
        <p>Khóa bí mật chung của B: <strong>{sharedSecretB}</strong></p>
      </div>
      
      {sharedSecretA === sharedSecretB && (
        <div className="alert alert-success mt-4">
          Khóa bí mật chung đã được trao đổi thành công!
        </div>
      )}
      {sharedSecretA !== sharedSecretB && sharedSecretA !== 0 && (
        <div className="alert alert-danger mt-4">
          Khóa bí mật không khớp! Kiểm tra lại các giá trị.
        </div>
      )}
    </div>
  );
}

export default DiffieHellman;
