import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const determinant = (matrix) => {
  if (matrix.length === 2) {
    // Định thức cho ma trận 2x2
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  } else if (matrix.length === 3) {
    // Định thức cho ma trận 3x3
    return (
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
  }
  return null; // Trường hợp ma trận không hợp lệ
};

const modInverse = (a, mod) => {
  a = ((a % mod) + mod) % mod;
  for (let x = 1; x < mod; x++) {
    if ((a * x) % mod === 1) {
      return x;
    }
  }
  return null;
};
// Tính ma trận nghịch đảo
const modInverseMatrix = (matrix, mod) => {
  const det = determinant(matrix);
  const invDet = modInverse(det, mod);
  if (invDet === null) return null;

  if (matrix.length === 2) {
    // Ma trận nghịch đảo 2x2
    const inverseMatrix = [
      [(matrix[1][1] * invDet) % mod, (-matrix[0][1] * invDet) % mod],
      [(-matrix[1][0] * invDet) % mod, (matrix[0][0] * invDet) % mod],
    ];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (inverseMatrix[i][j] < 0) inverseMatrix[i][j] += mod;
      }
    }

    return inverseMatrix;
  } else if (matrix.length === 3) {
    const adjugateMatrix = [
      [
        (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) * invDet,
        -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) * invDet,
        (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invDet,
      ],
      [
        -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) * invDet,
        (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invDet,
        -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) * invDet,
      ],
      [
        (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) * invDet,
        -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) * invDet,
        (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) * invDet,
      ],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        adjugateMatrix[i][j] = ((adjugateMatrix[i][j] % mod) + mod) % mod;
      }
    }
    return adjugateMatrix;
  }

  return null;
};


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
    setMatrixSize(size);
    setKeyMatrix(generateEmptyMatrix(size));
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
    const textBlocks = filteredText.match(new RegExp(`.{1,${n}}`, "g"));

    let encryptedText = "";

    for (let block of textBlocks) {
      let blockVector = block.split("").map((char) => charToNum(char));
      // console.log(blockVector)
      let encryptedVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          encryptedVector[i] += (matrix[j][i] * blockVector[j]);
        }
        encryptedVector[i] = encryptedVector[i] % m; // Lấy modulo sau khi tính tổng
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
    //sử dụng ma trận nghịch đảo của ma trận khóa
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
        decryptedVector[i] += (inverseMatrix[j][i] * blockVector[j]) ;
      }
      decryptedVector[i] = decryptedVector[i] % m; // Lấy modulo sau khi tính tổng
    }
      decryptedText += decryptedVector.map((num) => numToChar(num)).join("");
    }

    return decryptedText;
  };

  const handleEncrypt = () => {
    if (!validateInput(inputText)) {
      setError(
        "Vui lòng chỉ nhập các ký tự chữ cái không dấu. Không nhập khoảng cách và ký tự đặc biệt"
      );
      setOutputText("");
      return;
    }

    const det = determinant(keyMatrix);
    if (!isCoprime(det, 26)) {
      setError(
        "Định thức của ma trận khóa phải là số nguyên tố cùng nhau với 26."
      );
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
                  value={
                    keyMatrix[rowIndex] ? keyMatrix[rowIndex][colIndex] : ""
                  }
                  onChange={(e) =>
                    handleMatrixChange(rowIndex, colIndex, e.target.value)
                  }
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
        <button onClick={handleDecrypt} className="btn btn-secondary">
          Giải Mã
        </button>
      </div>

      {outputText && (
        <div>
          <h3>Kết Quả:</h3>
          <p>{outputText}</p>
        </div>
      )}
    </div>
  );
}

export default MaHoaHill;