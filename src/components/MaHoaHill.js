import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MaHoaHill() {
  const [inputText, setInputText] = useState("");
  const [matrixSize, setMatrixSize] = useState(2); 
  const [keyMatrix, setKeyMatrix] = useState([[11, 8], [3, 7]]); 
  const [outputText, setOutputText] = useState("");

  const handleMatrixChange = (row, col, value) => {
    const updatedMatrix = [...keyMatrix];
    updatedMatrix[row][col] = parseInt(value, 10);
    setKeyMatrix(updatedMatrix);
  };

  const generateEmptyMatrix = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(0));
  };

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setKeyMatrix(generateEmptyMatrix(size)); 
  };

  const hillEncrypt = (text, matrix) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const m = alphabet.length;
    const n = matrix.length; 

    const charToNum = (char) => alphabet.indexOf(char.toUpperCase());

    const numToChar = (num) => alphabet[num % m];

    while (text.length % n !== 0) text += "X"; 

    const textBlocks = text.match(new RegExp(`.{1,${n}}`, "g"));

    let encryptedText = "";

    for (let block of textBlocks) {
      let blockVector = block.split("").map((char) => charToNum(char));

      let encryptedVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          encryptedVector[i] += matrix[i][j] * blockVector[j];
        }
        encryptedVector[i] %= m; 
      }

      encryptedText += encryptedVector.map((num) => numToChar(num)).join("");
    }

    return encryptedText;
  };

  const handleEncrypt = () => {
    const result = hillEncrypt(inputText, keyMatrix);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Hill</h2>

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
        <h3>Kích Thước Ma Trận:</h3>
        <label>Nhập kích thước ma trận (n x n):</label>
        <input
          type="number"
          value={matrixSize}
          onChange={handleMatrixSizeChange}
          className="form-control"
          min="2"
          max="3"
        />
      </div>

      <div className="mb-3">
        <h3>Ma Trận Khóa:</h3>
        {Array.from({ length: matrixSize }).map((_, rowIndex) => (
          <div className="row mb-2" key={rowIndex}>
            {Array.from({ length: matrixSize }).map((_, colIndex) => (
              <div className="col" key={colIndex}>
                <input
                  type="number"
                  value={keyMatrix[rowIndex] ? keyMatrix[rowIndex][colIndex] : ""}
                  onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                  className="form-control"
                  placeholder={`M[${rowIndex + 1}][${colIndex + 1}]`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <button onClick={handleEncrypt} className="btn btn-primary me-2">
          Mã Hóa
        </button>
      </div>

      <div className="mb-3">
        <h3>Bản Mã:</h3>
        <textarea
          readOnly
          value={outputText}
          className="form-control"
          rows="4"
        />
      </div>
    </div>
  );
}

export default MaHoaHill;
