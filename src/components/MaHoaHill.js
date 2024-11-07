import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//Hàm tính định thức
const determinant = (matrix) => {
  const size = matrix.length;
  if (size === 1) return matrix[0][0];
  if (size === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;
  //Laplace
  for (let col = 0; col < size; col++) {
    const subMatrix = matrix
      .slice(1)
      .map(row => row.filter((_, index) => index !== col));
    det += matrix[0][col] * determinant(subMatrix) * (col % 2 === 0 ? 1 : -1);
  }

  return det;
};
//Tính nghịch đảo của modul
const modInverse = (a, mod) => {
  a = ((a % mod) + mod) % mod;
  for (let x = 1; x < mod; x++) {
    if ((a * x) % mod === 1) {
      return x;
    }
  }
  return null;
};
//Ma trận nghịch đảo
const modInverseMatrix = (matrix, mod) => {
  // tìm định thức
  const det = determinant(matrix);
  // tính nghịch đảo của định thức
  const invDet = modInverse(det, mod);
  if (invDet === null) return null;

  const size = matrix.length;
  // ma trận kết quả
  const adjugateMatrix = Array(size).fill(null).map(() => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const subMatrix = matrix
        .filter((_, row) => row !== i)
        .map(row => row.filter((_, col) => col !== j));
      adjugateMatrix[j][i] = determinant(subMatrix) * (invDet * ((i + j) % 2 === 0 ? 1 : -1));
      adjugateMatrix[j][i] = ((adjugateMatrix[j][i] % mod) + mod) % mod;
    }
  }
  return adjugateMatrix;
};
// Kiểm tra 2 số nguyên tố cùng nhau
const isCoprime = (a, b) => {
  const gcd = (x, y) => {
    while (y) {
      [x, y] = [y, x % y];
    }
    return x;
  };
  return gcd(a, b) === 1;
};

function MaHoaHill() {
  const [inputText, setInputText] = useState("july");
  const [matrixSize, setMatrixSize] = useState(2);
  const [keyMatrix, setKeyMatrix] = useState([
    [11, 8],
    [3, 7],
  ]);
  // 231456789
  // 
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");

  const handleMatrixChange = (row, col, value) => {
    const updatedMatrix = keyMatrix.map((r) => [...r]);
    updatedMatrix[row][col] = parseInt(value, 10);
    setKeyMatrix(updatedMatrix);
  };

  const generateEmptyMatrix = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(0));
  };

  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    if (size >= 2 && size <= 5) {
      setMatrixSize(size);
      setKeyMatrix(generateEmptyMatrix(size));
    }
  };

  const validateInput = (text) => {
    const regex = /^[A-Za-z]+$/;
    return regex.test(text);
  };

  const hillEncrypt = (text, matrix) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const m = alphabet.length;
    const n = matrix.length;

    const charToNum = (char) => alphabet.indexOf(char.toUpperCase());
    const numToChar = (num) => alphabet[num % m];

    let filteredText = text.replace(/[^A-Za-z]/g, "").toUpperCase();
    while (filteredText.length % n !== 0) {
      filteredText += "X";
    }
    //chia khối
    const textBlocks = filteredText.match(new RegExp(`.{1,${n}}`, "g"));

    let encryptedText = "";

    for (let block of textBlocks) {
      let blockVector = block.split("").map((char) => charToNum(char));
      let encryptedVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          encryptedVector[i] += (matrix[j][i] * blockVector[j]);
        }
        encryptedVector[i] = encryptedVector[i] % m;
      }
      encryptedText += encryptedVector.map((num) => numToChar(num)).join("");
    }
    return encryptedText;
  };

  const hillDecrypt = (text, matrix) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const m = alphabet.length;
    const n = matrix.length;

    const charToNum = (char) => alphabet.indexOf(char.toUpperCase());
    const numToChar = (num) => alphabet[num % m];
    const inverseMatrix = modInverseMatrix(matrix, m);
    if (!inverseMatrix) {
      return "Không thể giải mã với ma trận khóa này.";
    }

    const textBlocks = text.match(new RegExp(`.{1,${n}}`, "g"));

    let decryptedText = "";

    for (let block of textBlocks) {
      let blockVector = block.split("").map((char) => charToNum(char));
      let decryptedVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          decryptedVector[i] += (inverseMatrix[j][i] * blockVector[j]);
        }
        decryptedVector[i] = decryptedVector[i] % m;
      }
      decryptedText += decryptedVector.map((num) => numToChar(num)).join("");
    }

    return decryptedText;
  };

  const handleEncrypt = () => {
    if (!validateInput(inputText)) {
      setError("Vui lòng chỉ nhập các ký tự chữ cái không dấu. Không nhập khoảng cách và ký tự đặc biệt.");
      setOutputText("");
      return;
    }

    const det = determinant(keyMatrix);
    if (!isCoprime(det, 26)) {
      setError("Định thức của ma trận khóa phải là số nguyên tố cùng nhau với 26.");
      setOutputText("");
      return;
    }

    setError("");
    const result = hillEncrypt(inputText, keyMatrix);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    if (!validateInput(inputText)) {
      setError("Vui lòng chỉ nhập các ký tự chữ cái không dấu.");
      setOutputText("");
      return;
    }

    const inverseMatrix = modInverseMatrix(keyMatrix, 26);
    if (!inverseMatrix) {
      setError("Ma trận khóa không có nghịch đảo, không thể giải mã.");
      setOutputText("");
      return;
    }

    setError("");
    const result = hillDecrypt(inputText, keyMatrix);
    setOutputText(result);
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Hill</h2>

      <div className="mb-3">
        <h3>Bản Rõ hoặc Bản Mã:</h3>
        <label>Nhập bản rõ hoặc bản mã:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="form-control"
        />
        {error && <p className="text-danger">{error}</p>}
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
          max="5"
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
        <button onClick={handleEncrypt} className="btn btn-primary me-3">Mã hóa</button>
        <button onClick={handleDecrypt} className="btn btn-secondary">Giải mã</button>
      </div>

      <div className="mb-3">
        <h3>Kết Quả:</h3>
        <textarea
          className="form-control"
          rows="3"
          value={outputText}
          readOnly
        />
      </div>
    </div>
  );
}

export default MaHoaHill;
