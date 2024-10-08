import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MaHoaThayThe() {
  const [inputText, setInputText] = useState('');
  const [Khoa, setKhoa] = useState('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [outputText, setOutputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrorMessage, setInputErrorMessage] = useState(''); // Thêm trạng thái cho lỗi nhập bản rõ

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const isKiemTraKhoa = (Khoa) => {
    const uniqueChars = new Set(Khoa);
    return uniqueChars.size === 26; 
  };

  const maHoa = (text, Khoa) => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        const index = alphabet.indexOf(char);
        return index !== -1 ? Khoa[index] : char;
      })
      .join('');
  };

  const giaiMa = (text, Khoa) => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        const index = Khoa.indexOf(char);
        return index !== -1 ? alphabet[index] : char;
      })
      .join('');
  };

  const handleEncrypt = () => {
    if (isKiemTraKhoa(Khoa)) {
      const result = maHoa(inputText, Khoa);
      setOutputText(result);
      setErrorMessage('');
    } else {
      setErrorMessage('Bảng chữ cái thay thế không hợp lệ! Hãy đảm bảo đủ 26 ký tự và không có ký tự trùng.');
    }
  };

  const handleDecrypt = () => {
    if (isKiemTraKhoa(Khoa)) {
      const result = giaiMa(inputText, Khoa);
      setOutputText(result);
      setErrorMessage('');
    } else {
      setErrorMessage('Bảng chữ cái thay thế không hợp lệ! Hãy đảm bảo đủ 26 ký tự và không có ký tự trùng.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z]+$/;

    if (value === '' || regex.test(value)) {
      setInputText(value.toUpperCase());
      setInputErrorMessage('');
    } else {
      setInputErrorMessage('Chỉ được nhập chữ cái không dấu.');
    }
  };

  return (
    <div className="container mt-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Mã Hóa Thay Thế</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h3>Bản Rõ:</h3>
            <label>Nhập bản rõ:</label>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              className="form-control"
            />
            {inputErrorMessage && (
              <p className="text-danger">{inputErrorMessage}</p>
            )}
          </div>

          <div className="mb-3">
            <label>Nhập bảng chữ cái thay thế (26 ký tự):</label>
            <input
              type="text"
              value={Khoa}
              onChange={(e) => setKhoa(e.target.value.toUpperCase())}
              className="form-control"
              maxLength={26}
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}

          <div className="text-center mb-4">
            <button onClick={handleEncrypt} className="btn btn-primary me-2" disabled={inputErrorMessage}>
              Mã Hóa
            </button>
            <button onClick={handleDecrypt} className="btn btn-secondary" disabled={inputErrorMessage}>
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

export default MaHoaThayThe;
