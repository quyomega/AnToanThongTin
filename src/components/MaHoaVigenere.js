import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaVigenere() {
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [outputText, setOutputText] = useState('');

  // Hàm mã hóa Vigenère
  const vigenereEncrypt = (text, keyword) => {
    let encryptedText = '';
    keyword = keyword.toLowerCase();
    let keywordIndex = 0;

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      if (/[a-zA-Z]/.test(char)) {
        const base = char.charCodeAt(0) < 97 ? 65 : 97;
        const shift = keyword.charCodeAt(keywordIndex % keyword.length) - 97;
        encryptedText += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        keywordIndex++; // Chỉ tăng keywordIndex khi mã hóa ký tự là chữ cái
      } else {
        encryptedText += char; // Giữ nguyên các ký tự không phải chữ cái
      }
    }

    return encryptedText;
  };

  // Hàm giải mã Vigenère
  const vigenereDecrypt = (text, keyword) => {
    let decryptedText = '';
    keyword = keyword.toLowerCase();
    let keywordIndex = 0;

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      if (/[a-zA-Z]/.test(char)) {
        const base = char.charCodeAt(0) < 97 ? 65 : 97;
        const shift = keyword.charCodeAt(keywordIndex % keyword.length) - 97;
        decryptedText += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        keywordIndex++; // Chỉ tăng keywordIndex khi mã hóa ký tự là chữ cái
      } else {
        decryptedText += char; // Giữ nguyên các ký tự không phải chữ cái
      }
    }

    return decryptedText;
  };

  const handleEncrypt = () => {
    const result = vigenereEncrypt(inputText, keyword);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = vigenereDecrypt(inputText, keyword);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Vigenère</h2>
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
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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

export default MaHoaVigenere;
