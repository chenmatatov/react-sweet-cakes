# 🍰 Sweet Cakes - הוראות העלאה לאוויר

## שלב 1 - העלאת מסד הנתונים ל-MongoDB Atlas (חינם)

1. היכנסי ל-[mongodb.com/atlas](https://www.mongodb.com/atlas) והירשמי
2. צרי **Cluster חינמי** (M0 Free)
3. תחת **Database Access** - צרי משתמש עם סיסמה
4. תחת **Network Access** - הוסיפי `0.0.0.0/0` (גישה מכל מקום)
5. לחצי **Connect → Drivers** והעתיקי את ה-Connection String:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sweet-cakes
   ```

---

## שלב 2 - העלאת השרת ל-Render

1. היכנסי ל-[render.com](https://render.com) והתחברי עם GitHub
2. לחצי **New → Web Service**
3. בחרי את ה-Repository ואת תיקיית **SERVER**
4. הגדרות:
   - **Root Directory:** `SERVER`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. תחת **Environment Variables** הוסיפי:
   - `MONGODB_URI` = ה-Connection String מ-Atlas
   - `JWT_SECRET` = מחרוזת סודית ארוכה (לדוגמה: `sweet-cakes-super-secret-2024`)
   - `CLIENT_URL` = הכתובת של הקליינט ב-Vercel (תמלאי אחרי שלב 3)
   - `PORT` = `10000`
6. לחצי **Deploy**
7. שמרי את הכתובת (לדוגמה: `https://sweet-cakes-api.onrender.com`)

### הכנסת נתונים ראשונית לאטלס
אחרי שהשרת עלה ב-Render, הריצי פעם אחת מקומית עם ה-MONGODB_URI של אטלס:
```bash
cd SERVER
# שני את MONGODB_URI ב-.env לכתובת האטלס
npm run seed
# אחרי הסיד - החזירי את ה-.env למקומי
```

---

## שלב 3 - העלאת הקליינט ל-Vercel

1. היכנסי ל-[vercel.com](https://vercel.com) והתחברי עם GitHub
2. לחצי **Add New → Project**
3. בחרי את ה-Repository ואת תיקיית **my-project**
4. הגדרות:
   - **Root Directory:** `my-project`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. תחת **Environment Variables** הוסיפי:
   - `VITE_API_URL` = הכתובת של השרת מ-Render
6. לחצי **Deploy**

---

## לאחר ההעלאה

- עדכני ב-Render את `CLIENT_URL` לכתובת של Vercel
- פתחי את האתר בגלישה בסתר
- בדקי שהמוצרים נטענים (F12 → Network → סטטוס 200)
