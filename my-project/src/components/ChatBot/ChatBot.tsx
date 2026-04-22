import { useState, useRef, useEffect } from "react";
import "./ChatBot.scss";

interface Message {
  from: "bot" | "user";
  text: string;
}

const QUICK = ["שעות פתיחה?", "יש משלוח?", "מה יש בתפריט?", "האם כשר?"];

const getReply = (msg: string): string => {
  const m = msg.trim().toLowerCase();

  if (m.includes("שלום") || m.includes("היי") || m.includes("הי") || m.includes("בוקר") || m.includes("ערב"))
    return "היי! 🎂 ברוכים הבאים ל-Sweet Cakes! איך אפשר לעזור?";

  if (m.includes("שעות") || m.includes("פתיחה") || m.includes("סגירה") || m.includes("פתוח"))
    return "🕐 שעות הפעילות שלנו:\nראשון–חמישי: 08:00–20:00\nשישי: 08:00–14:00\nשבת: סגור";

  if (m.includes("משלוח") || m.includes("שליח") || m.includes("배달"))
    return "🚚 כן! אנחנו מספקים משלוחים לכל הארץ.\nמשלוח עד הבית תוך 1–3 ימי עסקים.\nמשלוח חינם בהזמנה מעל ₪200!";

  if (m.includes("תפריט") || m.includes("מוצר") || m.includes("עוגה") || m.includes("מה יש") || m.includes("קטגור"))
    return "🍰 יש לנו מגוון רחב:\n• עוגות קומות\n• עוגות מספרים\n• מקרונים\n• קינוחים\n• עוגיות\n• פאי ומאפים\n\nכנסי לדף המוצרים לצפייה בכל הקטלוג!";

  if (m.includes("כשר") || m.includes("כשרות"))
    return "✅ כל המוצרים שלנו כשרים למהדרין תחת השגחה מוכרת!";

  if (m.includes("מחיר") || m.includes("עלות") || m.includes("כמה עולה") || m.includes("כמה זה"))
    return "💰 המחירים שלנו מתחילים מ-₪25 לעוגיות ועד ₪350 לעוגות קומות יוקרתיות.\nניתן לראות את כל המחירים בדף המוצרים!";

  if (m.includes("הזמנה") || m.includes("להזמין") || m.includes("איך מזמינים"))
    return "🛒 להזמנה:\n1. בחרי מוצר מהקטלוג\n2. הוסיפי לסל\n3. לחצי על 'לתשלום'\n4. מלאי פרטי משלוח ותשלום\nוזהו! 🎉";

  if (m.includes("ביטול") || m.includes("לבטל"))
    return "❌ לביטול הזמנה יש לפנות אלינו עד 24 שעות לפני מועד האספקה.\nניתן לפנות דרך הצ'אט או בטלפון.";

  if (m.includes("טלפון") || m.includes("ליצור קשר") || m.includes("צור קשר") || m.includes("פנייה"))
    return "📞 ניתן לפנות אלינו:\nטלפון: 050-1234567\nאימייל: info@sweetcakes.co.il\nאו כמובן דרך הצ'אט הזה 😊";

  if (m.includes("אלרג") || m.includes("גלוטן") || m.includes("טבעוני") || m.includes("ללא"))
    return "🌿 יש לנו מוצרים ללא גלוטן וטבעוניים!\nחפשי בדף המוצרים או שאלי אותנו על מוצר ספציפי.";

  if (m.includes("תודה") || m.includes("תודה רבה"))
    return "בשמחה! 🍰 תמיד כאן לעזור. שיהיה לך יום מתוק! 🌸";

  return "מצטערת, לא הבנתי את השאלה 😅\nנסי לשאול על: תפריט, מחירים, משלוח, שעות פתיחה, כשרות או הזמנות.";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "היי! 👋 אני Sweet Cakes Bot.\nנסי לשאול על: תפריט, מחירים, משלוח, שעות פתיחה או הזמנות." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text };
    const botMsg: Message = { from: "bot", text: getReply(text) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="chatbot-wrapper" dir="rtl">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-name">Sweet Cakes Bot 🎂</span>
              <span className="chatbot-status">● מחובר</span>
            </div>
            <div className="chatbot-avatar">🍰</div>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>
                {m.text.split("\n").map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick">
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="chatbot-input-row">
            <button className="chatbot-send" onClick={() => send(input)}>←</button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="כתבי שאלה..."
            />
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)}>
        {open ? "✕" : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M20 2H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11l5 3v-3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
