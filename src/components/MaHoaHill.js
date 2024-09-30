import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MaHoaHill() {
  const [inputText, setInputText] = useState("");
  const [matrixSize, setMatrixSize] = useState(2); // Khởi tạo ma trận kích thước 2x2
  const [keyMatrix, setKeyMatrix] = useState([[11, 8], [3, 7]]); // Ma trận khóa mặc định 2x2
  const [outputText, setOutputText] = useState("");

  // Hàm cập nhật giá trị của ma trận khóa
  const handleMatrixChange = (row, col, value) => {
    const updatedMatrix = [...keyMatrix];
    updatedMatrix[row][col] = parseInt(value, 10);
    setKeyMatrix(updatedMatrix);
  };

  // Hàm tạo ma trận khóa trống dựa trên kích thước ma trận
  const generateEmptyMatrix = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(0));
  };

  // Hàm xử lý thay đổi kích thước ma trận
  const handleMatrixSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setMatrixSize(size);
    setKeyMatrix(generateEmptyMatrix(size)); // Cập nhật ma trận trống dựa trên kích thước mới
  };

  // Hàm mã hóa Hill
  const hillEncrypt = (text, matrix) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const m = alphabet.length;
    const n = matrix.length; // Số hàng (và cột) của ma trận

    // Hàm chuyển ký tự thành số (A = 0, B = 1, ..., Z = 25)
    const charToNum = (char) => alphabet.indexOf(char.toUpperCase());

    // Hàm chuyển số thành ký tự
    const numToChar = (num) => alphabet[num % m];

    // Chuyển văn bản thành các khối ký tự
    while (text.length % n !== 0) text += "X"; // Thêm 'X' nếu không đủ khối

    const textBlocks = text.match(new RegExp(`.{1,${n}}`, "g")); // Tạo khối n ký tự

    let encryptedText = "";

    for (let block of textBlocks) {
      let blockVector = block.split("").map((char) => charToNum(char));

      // Tạo vector kết quả bằng cách nhân ma trận khóa với vector ký tự
      let encryptedVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          encryptedVector[i] += matrix[i][j] * blockVector[j];
        }
        encryptedVector[i] %= m; // Modulo 26 để giữ kết quả trong bảng chữ cái
      }

      // Chuyển vector kết quả thành chuỗi mã hóa
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

      {/* Nhập bản rõ */}
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

      {/* Nhập kích thước ma trận */}
      <div className="mb-3">
        <h3>Kích Thước Ma Trận:</h3>
        <label>Nhập kích thước ma trận (n x n):</label>
        <input
          type="number"
          value={matrixSize}
          onChange={handleMatrixSizeChange}
          className="form-control"
          min="2"
          max="5" // Giới hạn kích thước từ 2x2 đến 5x5 để đơn giản hóa
        />
      </div>

      {/* Nhập ma trận khóa */}
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

      {/* Nút mã hóa */}
      <div className="text-center mb-4">
        <button onClick={handleEncrypt} className="btn btn-primary me-2">
          Mã Hóa
        </button>
      </div>

      {/* Hiển thị bản mã */}
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
