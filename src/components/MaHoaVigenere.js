import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaVigenere() {
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [outputText, setOutputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
//hàm mã hóa
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
        keywordIndex++;
      } else {
        encryptedText += char;
      }
    }

    return encryptedText.toUpperCase();
  };

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
        keywordIndex++;
      } else {
        decryptedText += char;
      }
    }

    return decryptedText.toUpperCase();
  };

  const isValidInput = (text) => {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(text);
  };

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122)) {
      event.preventDefault();
      setErrorMessage('Chỉ được nhập chữ cái. Không nhập số, dấu cách hoặc ký tự đặc biệt.');
    } else {
      setErrorMessage('');
    }
  };

  const handleEncrypt = () => {
    if (!isValidInput(inputText)) {
      setErrorMessage('Bản rõ chỉ được chứa các ký tự chữ cái.');
      setOutputText('');
    } else if (!isValidInput(keyword)) {
      setErrorMessage('Từ khóa chỉ được chứa các ký tự chữ cái.');
      setOutputText('');
    } else {
      setErrorMessage('');
      const result = vigenereEncrypt(inputText, keyword);
      setOutputText(result);
    }
  };

  const handleDecrypt = () => {
    if (!isValidInput(inputText)) {
      setErrorMessage('Bản rõ chỉ được chứa các ký tự chữ cái.');
      setOutputText('');
    } else if (!isValidInput(keyword)) {
      setErrorMessage('Từ khóa chỉ được chứa các ký tự chữ cái.');
      setOutputText('');
    } else {
      setErrorMessage('');
      const result = vigenereDecrypt(inputText, keyword);
      setOutputText(result);
    }
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
              onKeyPress={handleKeyPress}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Nhập từ khóa:</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-control"
            />
          </div>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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
