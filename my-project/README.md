# 🍰 Sweet Cakes - אתר עוגות מתוקות

אתר מכירת עוגות מעוצבות ומתוקים בנוי ב-React עם TypeScript ושרת Node.js עם MongoDB.

## ✨ תכונות

- 🏠 דף בית עם תמונת רקע מרהיבה
- 🧁 קטלוג מוצרים עם פילטר קטגוריות ופייג'ינג
- 👁️ פרטי מוצר עם מערכת ביקורות ודירוגים
- 👤 ניהול משתמשים - הרשמה והתחברות
- 🔐 פאנל אדמין להוספה ומחיקת מוצרים
- 📱 עיצוב רספונסיבי לכל המכשירים
- 🗑️ מודלים יפים לאישור פעולות

## 🛠️ טכנולוגיות

- **Frontend**: React 18 + TypeScript
- **Styling**: SCSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Forms**: Formik + Yup
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Build Tool**: Vite

## 🚀 התקנה והרצה

### דרישות מקדימות
- Node.js מותקן
- MongoDB מותקן ורץ על המחשב

### טרמינל 1 - הרצת השרת
```bash
cd SERVER
npm install
npm run dev
```
השרת יעלה על: http://localhost:3000

### טרמינל 2 - הרצת הקליינט
```bash
cd my-project
npm install
npm run dev
```
האפליקציה תעלה על: http://localhost:5173

### הכנסת נתונים למסד הנתונים (פעם אחת בלבד - רק בהתקנה ראשונית)
```bash
cd SERVER
npm run seed
```
זה יכניס למונגו: קטגוריות, משתמשים, מוצרים וביקורות.
⚠️ אל תריצי שוב - זה ימחק את כל הנתונים הקיימים!

## 📁 מבנה הפרויקט

```
react-sweet-cakes/
├── my-project/          # קליינט React
│   └── src/
│       ├── components/  # כל הקומפוננטות
│       ├── context/     # Cart ו-Favorites
│       ├── models/      # טיפוסי TypeScript
│       └── api.ts       # חיבור לשרת
└── SERVER/              # שרת Node.js
    └── src/
        ├── config/      # חיבור למונגו
        ├── models/      # מודלי Mongoose
        ├── routes/      # API routes
        ├── middleware/  # JWT auth
        └── seed.ts      # הכנסת נתונים ראשונית
```

## 👥 סוגי משתמשים

**משתמש רגיל**
- צפייה במוצרים
- כתיבת ביקורות
- עריכת פרופיל אישי

**אדמין**
- כל הפעולות של משתמש רגיל
- הוספת מוצרים חדשים
- מחיקת מוצרים
- מחיקת ביקורות

### פרטי כניסה לאדמין
- אימייל: `chen@example.com`
- סיסמה: `Chen1234!`

## 📊 נתונים

הפרויקט משתמש ב-MongoDB עם האוספים:
- `users` - משתמשים
- `products` - מוצרים
- `categories` - קטגוריות
- `reviews` - ביקורות
- `orders` - הזמנות

## 🌟 תכונות מיוחדות

- מודלים מותאמים אישית במקום alert רגיל
- אנימציות CSS מתקדמות
- פייג'ינג חכם עם חזרה לתחילת העמוד
- עיצוב מותאם לעברית עם RTL
- ביקורות עם דירוגי כוכבים

---

**נוצר עם ❤️ ו-React**
