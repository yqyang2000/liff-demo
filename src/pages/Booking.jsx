
import { useState } from "react";
import "./Booking.css";

function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "",
    arrivalTime: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // 更新欄位資料
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // 欄位驗證
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "請輸入入住代表姓名";
    }

    if (!formData.checkIn) {
      newErrors.checkIn = "請選擇入住日期";
    }

    if (!formData.checkOut) {
      newErrors.checkOut = "請選擇退房日期";
    } else if (
      formData.checkIn &&
      formData.checkOut <= formData.checkIn
    ) {
      newErrors.checkOut = "退房日期必須晚於入住日期";
    }

    if (Number(formData.guests) < 1) {
      newErrors.guests = "入住人數至少為 1 人";
    }

    if (!formData.roomType) {
      newErrors.roomType = "請選擇房型";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 送出表單
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitted(true);
    }
  };

  // 重新修改
  const handleEdit = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="booking-container">
        <h2>訂房資料確認</h2>

        <div className="summary">
          <p>入住代表姓名：{formData.name}</p>
          <p>入住日期：{formData.checkIn}</p>
          <p>退房日期：{formData.checkOut}</p>
          <p>入住人數：{formData.guests} 人</p>
          <p>房型偏好：{formData.roomType}</p>
          <p>抵達時間：{formData.arrivalTime || "未提供"}</p>
          <p>備註：{formData.note || "無"}</p>
        </div>

        <button onClick={handleEdit}>
          修改資料
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2>加賀屋訂房預約表單</h2>

      <form onSubmit={handleSubmit}>

        <label>入住代表姓名 *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="請輸入姓名"
        />
        <p className="error">{errors.name}</p>

        <label>入住日期 *</label>
        <input
          type="date"
          name="checkIn"
          min={new Date().toLocaleDateString("en-CA")}
          value={formData.checkIn}
          onChange={handleChange}
        />
        <p className="error">{errors.checkIn}</p>

        <label>退房日期 *</label>
        <input
          type="date"
          name="checkOut"
          min={formData.checkIn || new Date().toLocaleDateString("en-CA")}
          value={formData.checkOut}
          onChange={handleChange}
        />
        <p className="error">{errors.checkOut}</p>

        <label>入住人數 *</label>
        <input
          type="number"
          name="guests"
          min="1"
          value={formData.guests}
          onChange={handleChange}
        />
        <p className="error">{errors.guests}</p>

        <label>房型偏好 *</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="">請選擇房型</option>
          <option value="無景房">溫馨套房(無景)</option>
          <option value="有景房">園景雅致套房(有景)</option>
          <option value="露天房">半露天風呂套房</option>
          <option value="特別房">特別室套房</option>
        </select>
        <p className="error">{errors.roomType}</p>

        <label>預計抵達時間</label>
        <input
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
        />

        <label>備註</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="其他需求或特殊說明"
          rows="4"
        />

        <button type="submit">
          確認訂房資料
        </button>

      </form>
    </div>
  );
}

export default Booking;
