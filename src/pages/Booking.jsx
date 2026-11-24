
import { useEffect, useState } from "react";
import "./Booking.css";
import liff, {initLiff} from "../liff";

const ROOM_LABELS = {
  無景房:"溫馨套房(無景)",
  有景房:"園景雅致套房(有景)",
  露天房:"半露天風呂套房",
  特別房:"特別是套房",
};

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

  // LIFF相關狀套
  const [liffReady, setLiffReady] = useState(false);
  const [liffError, setLiffError] = useState("");
  const [profile, setProfile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // 初始化LIFF
  useEffect(() => {
    initLiff()
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({redirectUri: window.location.href});
          return;
        }
        const p = await liff.getProfile();
        setProfile(p);
        setFormData((prev) =>
          prev.name 
            ? prev
            : { ...prev, name: p.displayName}
        );
        setLiffReady(true);
      })
      .catch((err) => setLiffError(err.message));
  }, []);

  // 更新欄位資料
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]:value }));
    setErrors((prev) => ({ ...prev, [name]: ""}));
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

  const buildMessage = () =>
  [
    "【訂房資料確認】",
    `入住代表:${formData.name}`,
    `入住日期:${formData.checkIn}`,
    `退房日期:${formData.checkOut}`,
    `入住人數:${formData.guests}人`,
    `房型:${ROOM_LABELS[formData.roomType] || formData.roomType}`,
    `抵達時間:${formData.arrivalTime || "未提供"}`,
    `備註:${formData.note || "無"}`,
  ].join("\n");

  const handleConfirm = async () => {
    setSending(true);
    setLiffError("");
    try {
      if (liff.isInClient()) {
        await liff.sendMessages([{ 
          type: "text",
          text: buildMessage()
        }]);
        liff.closeWindow();
      }else {
        setSent(true);
      }
    }catch (err) {
      setLiffError(
        "資料傳送失敗，請從LINE聊天室重新開啟此頁面後再試一次。(" +
        err.message +
        ")"
      );
    }finally {
      setSending(flase);
    }
  };

  if (liffError && !liffReady) {
    return (
      <div className="booking-container">
        <p className="error">
          LINE 初始化失敗: {liffError}
        </p>
      </div>
    );
  }

  if (!liffReady) {
    return (
      <div className="booking-container">
        <p> 載入中... </p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="booking-container">
        <h2> 已收到您的預約 </h2>
        <p> 我們會盡快與您聯繫確認訂房 </p>
      </div>
    );
  }

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

        {liffError && <p className="error"> {liffError} </p>}

        <button onClick={handleEdit} disabled={sending}>
          修改資料
        </button>
        <button onClick={handleConfirm} disabled={sending}>
          {sending
            ? "送出中..."
            : "確認送出預約"
          }
        </button> 
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2>加賀屋訂房預約表單</h2>

      {profile && (
        <div className="line-user">
          <span>
            {profile.displayName}，您好
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>入住代表姓名 *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="請輸入姓名"
        />
        <p className="error">
          {errors.name}
        </p>

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
          {Object.entries(ROOM_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <p className="error">
          {errors.roomType}
        </p>

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
