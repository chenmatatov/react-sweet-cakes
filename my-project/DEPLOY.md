# 🍰 Sweet Cakes - הוראות העלאה לאוויר

## הכנה לפני העלאה

### 1. בדיקת Build מקומי
```bash
npm run build
```
אם אין שגיאות — הפרויקט מוכן.

---

## העלאת ה-Backend (JSON Server) ל-Render

1. היכנסי ל-[render.com](https://render.com) והתחברי עם GitHub
2. לחצי **New → Web Service**
3. בחרי את ה-Repository
4. הגדרות:
   - **Build Command:** `npm install`
   - **Start Command:** `npx json-server --watch db.json --port 10000 --host 0.0.0.0`
   - **Port:** `10000`
5. לחצי **Deploy**
6. שמרי את הכתובת שתקבלי (למשל: `https://sweet-cakes-api.onrender.com`)

---

## העלאת ה-Frontend ל-Vercel

1. היכנסי ל-[vercel.com](https://vercel.com) והתחברי עם GitHub
2. לחצי **Add New → Project**
3. בחרי את ה-Repository
4. הגדרות Build:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. תחת **Environment Variables** הוסיפי:
   - `VITE_API_URL` = הכתובת של ה-Render (למשל `https://sweet-cakes-api.onrender.com`)
6. לחצי **Deploy**

---

## לאחר ההעלאה
- פתחי את האתר בגלישה בסתר
- בדקי שהמוצרים נטענים (F12 → Network → סטטוס 200)
