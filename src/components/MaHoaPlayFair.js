import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MaHoaPlayfair() {
  const [inputText, setInputText] = useState("");
  const [key, setKey] = useState("");
  const [outputText, setOutputText] = useState("");

  const playfairEncrypt = (text, key) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const keySquare = generateKeySquare(key, alphabet);

    const formattedText = formatText(text);

    let encryptedText = "";
    for (let i = 0; i < formattedText.length; i += 2) {
      const pair = formattedText.slice(i, i + 2);
      const encryptedPair = encryptPair(pair, keySquare);
      encryptedText += encryptedPair;
    }

    return encryptedText;
  };

  const playfairDecrypt = (text, key) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const keySquare = generateKeySquare(key, alphabet);
    let decryptedText = "";

    for (let i = 0; i < text.length; i += 2) {
      const pair = text.slice(i, i + 2);
      const decryptedPair = decryptPair(pair, keySquare);
      decryptedText += decryptedPair;
    }

    return decryptedText;
  };

  const generateKeySquare = (key, alphabet) => {
    const uniqueKey = Array.from(new Set(key.toUpperCase().replace(/J/g, "I")));
    let keySquare = [...uniqueKey];

    for (let char of alphabet) {
      if (!keySquare.includes(char)) {
        keySquare.push(char);
      }
    }

    return keySquare; 
  };

  const formatText = (text) => {
    let formattedText = text
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");

    let result = "";
    for (let i = 0; i < formattedText.length; i += 2) {
      const first = formattedText[i];
      const second = formattedText[i + 1];

      if (second === first) {
        result += first + "X";
        i--; 
      } else if (!second) {
        result += first + "X";
      } else {
        result += first + second;
      }
    }

    return result;
  };
  const encryptPair = (pair, keySquare) => {
    const size = 5;
    const [row1, col1] = findPosition(pair[0], keySquare, size);
    const [row2, col2] = findPosition(pair[1], keySquare, size);

    let encryptedPair = "";
    if (row1 === row2) {
      encryptedPair =
        keySquare[row1 * size + (col1 + 1) % size] +
        keySquare[row2 * size + (col2 + 1) % size];
    } else if (col1 === col2) {
      encryptedPair =
        keySquare[((row1 + 1) % size) * size + col1] +
        keySquare[((row2 + 1) % size) * size + col2];
    } else {
      encryptedPair =
        keySquare[row1 * size + col2] + keySquare[row2 * size + col1];
    }

    return encryptedPair;
  };

  const decryptPair = (pair, keySquare) => {
    const size = 5;
    const [row1, col1] = findPosition(pair[0], keySquare, size);
    const [row2, col2] = findPosition(pair[1], keySquare, size);

    let decryptedPair = "";
    if (row1 === row2) {
      decryptedPair =
        keySquare[row1 * size + (col1 + size - 1) % size] +
        keySquare[row2 * size + (col2 + size - 1) % size];
    } else if (col1 === col2) {
      decryptedPair =
        keySquare[((row1 + size - 1) % size) * size + col1] +
        keySquare[((row2 + size - 1) % size) * size + col2];
    } else {
      decryptedPair =
        keySquare[row1 * size + col2] + keySquare[row2 * size + col1];
    }

    return decryptedPair;
  };

  const findPosition = (char, keySquare, size) => {
    const index = keySquare.indexOf(char);
    return [Math.floor(index / size), index % size];
  };

  const handleKeyChange = (e) => {
    const input = e.target.value;
    const filteredInput = input.replace(/[^a-zA-Z]/g, ""); 
    setKey(filteredInput);
  };

  const handleInputTextChange = (e) => {
    const input = e.target.value;
    const filteredInput = input.replace(/[^a-zA-Z]/g, ""); 
    setInputText(filteredInput);
  };

  const handleEncrypt = () => {
    const result = playfairEncrypt(inputText, key);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const result = playfairDecrypt(inputText, key);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Playfair</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h3>Bản Rõ:</h3>
            <label>Nhập bản rõ:</label>
            <input
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>Nhập khóa (chỉ chữ cái):</label>
            <input
              type="text"
              value={key}
              onChange={handleKeyChange} 
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

export default MaHoaPlayfair;
