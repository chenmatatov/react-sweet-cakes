import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db";
import User from "./models/User";
import { Category, Product } from "./models/Product";
import Review from "./models/Review";

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Review.deleteMany({});
  console.log("🗑️  Cleared existing data");

  // Seed Categories
  const categoriesData = [
    { name: "עוגות" },
    { name: "עוגות קומות" },
    { name: "עוגות מספרים" },
    { name: "קינוחים" },
    { name: "עוגיות" },
    { name: "פאי" },
  ];
  const categories = await Category.insertMany(categoriesData);
  const catMap: Record<number, mongoose.Types.ObjectId> = {
    1: categories[0]._id as mongoose.Types.ObjectId,
    2: categories[1]._id as mongoose.Types.ObjectId,
    3: categories[2]._id as mongoose.Types.ObjectId,
    4: categories[3]._id as mongoose.Types.ObjectId,
    5: categories[4]._id as mongoose.Types.ObjectId,
    6: categories[5]._id as mongoose.Types.ObjectId,
  };
  console.log("✅ Categories seeded");

  // Seed Users (passwords will be hashed by pre-save hook)
  const usersData = [
    { name: "חן מטאטוב", email: "chen@example.com", password: "Chen1234!", phone: "0501234567", city: "תל אביב", isAdmin: true },
    { name: "נועה כהן", email: "noa@example.com", password: "Noa12345!", phone: "0521234567", city: "ירושלים", isAdmin: false },
    { name: "מיה בר", email: "mya@example.com", password: "Mya12345!", phone: "0531234567", city: "חיפה", isAdmin: false },
    { name: "דנה שמש", email: "dana@example.com", password: "Dana1234!", phone: "0541234567", city: "באר שבע", isAdmin: false },
    { name: "יואב כהן", email: "yoav@example.com", password: "Yoav1234!", phone: "0551234567", city: "רמת גן", isAdmin: true },
    { name: "אסף לוי", email: "assaf@example.com", password: "Assaf123!", phone: "0561234567", city: "פתח תקווה", isAdmin: false },
    { name: "מיכל לוי", email: "michal@example.com", password: "Michal12!", phone: "0571234567", city: "נתניה", isAdmin: false },
    { name: "רוני כהן", email: "roni@example.com", password: "Roni1234!", phone: "0581234567", city: "אשדוד", isAdmin: false },
    { name: "דניאל שמש", email: "daniel@example.com", password: "Daniel1!", phone: "0591234567", city: "ראשון לציון", isAdmin: false },
    { name: "יעל בר", email: "yael@example.com", password: "Yael1234!", phone: "0501112233", city: "הרצליה", isAdmin: false },
  ];

  const users: any[] = [];
  for (const u of usersData) {
    const user = new User(u);
    await user.save();
    users.push(user);
  }
  console.log("✅ Users seeded");

  // Seed Products
  const productsData = [
    { name: "עוגות מספר 18", categoryId: catMap[3], price: 195, image: "/images/Numbercake18.jpg", description: "עוגת מספר 18 מעוצבת בקפידה עם קרם עשיר וקישוטים אלגנטיים, מושלמת לחגיגת יום הולדת מרגשת.", buyCount: 16 },
    { name: "עוגות מספר 40", categoryId: catMap[3], price: 220, image: "/images/Numbercake40.jpg", description: "עוגת מספר 40 חגיגית ומרשימה, משלבת מראה יוקרתי עם טעמים אהובים.", buyCount: 10 },
    { name: "מקרון צבעוני", categoryId: catMap[4], price: 30, image: "/images/macarons.jpg", description: "מקרונים צבעוניים ועדינים במילוי קרם עשיר, נמסים בפה ומוסיפים צבע ומתיקות לכל אירוע.", buyCount: 30 },
    { name: "עוגת גבינה", categoryId: catMap[1], price: 95, image: "/images/cheesecake.jpg", description: "עוגת גבינה אפויה במרקם קרמי וחלק, עם טעם קלאסי ואהוב שמתאים לכל רגע.", buyCount: 16 },
    { name: "עוגת קומות זהב", categoryId: catMap[2], price: 300, image: "/images/tiered-gold-cake.jpg", description: "עוגת קומות יוקרתית בגימור זהב מרשים, מושלמת לאירועים מיוחדים ויוקרתיים.", buyCount: 8 },
    { name: "עוגת קומות וניל", categoryId: catMap[2], price: 170, image: "/images/tiered-vanilla-cake.jpg", description: "עוגת קומות וניל רכה ואוורירית עם קרם עדין, קלאסית ומתאימה לכל חגיגה.", buyCount: 30 },
    { name: "עוגת קומות שוקולד קלאסית", categoryId: catMap[2], price: 180, image: "/images/tiered-chocolate-cake.jpg", description: "עוגת קומות שוקולד עשירה עם שכבות קרם מפנקות, לאוהבי שוקולד אמיתיים.", buyCount: 21 },
    { name: "קרם ברולה", categoryId: catMap[4], price: 15, image: "/images/creme-brulee.jpg", description: "קרם וניל קטיפתי עם שכבת קרמל פריכה, קינוח צרפתי קלאסי ומפנק.", buyCount: 1 },
    { name: "עוגת שוקולד", categoryId: catMap[1], price: 80, image: "/images/chocolate-cake.jpg", description: "עוגת שוקולד רכה ועשירה בטעם עמוק, קלאסיקה אהובה על כולם.", buyCount: 2 },
    { name: "עוגות מספר 30", categoryId: catMap[3], price: 200, image: "/images/Numbercake30.jpg", description: "עוגת מספר 30 בעיצוב חגיגי ומרשים, מושלמת ליום הולדת עגול.", buyCount: 15 },
    { name: "עוגות מספר 70", categoryId: catMap[3], price: 290, image: "/images/Numbercake70.jpg", description: "עוגת מספר 70 אלגנטית וחגיגית, משלבת עיצוב יוקרתי וטעמים איכותיים.", buyCount: 12 },
    { name: "עוגת קומות רד וולווט", categoryId: catMap[2], price: 210, image: "/images/tiered-red-velvet-cake.jpg", description: "עוגת רד וולווט עשירה בצבע אדום עמוק עם קרם גבינה עדין.", buyCount: 21 },
    { name: "סופלה שוקולד", categoryId: catMap[4], price: 38, image: "/images/souffle-chocolate.jpg", description: "סופלה שוקולד חמים עם לב נוזלי, קינוח מושלם לסיום ארוחה.", buyCount: 18 },
    { name: "עוגת קומות פירות", categoryId: catMap[2], price: 195, image: "/images/tiered-fruit-cake.jpg", description: "עוגת קומות מרעננת עם פירות טריים, צבעונית ומתאימה לאירועי קיץ.", buyCount: 19 },
    { name: "טירמיסו", categoryId: catMap[4], price: 80, image: "/images/tiramisu.jpg", description: "טירמיסו איטלקי קלאסי עם קרם מסקרפונה וקפה איכותי.", buyCount: 19 },
    { name: "עוגות מספר 35", categoryId: catMap[3], price: 210, image: "/images/Numbercake35.jpg", description: "עוגת מספר 35 מעוצבת ומרשימה, מושלמת לחגיגה משפחתית.", buyCount: 19 },
    { name: "עוגת קומות שחור לבן", categoryId: catMap[2], price: 205, image: "/images/tiered-black-white-cake.jpg", description: "עוגת קומות אלגנטית בשחור ולבן, בעיצוב קלאסי ועל-זמני.", buyCount: 30 },
    { name: "עוגת גזר", categoryId: catMap[1], price: 45, image: "/images/carrot-cake.jpg", description: "עוגת גזר רכה עם תבלינים עדינים וציפוי גבינה עשיר.", buyCount: 1 },
    { name: "עוגות מספר 10", categoryId: catMap[3], price: 170, image: "/images/Numbercake10.jpg", description: "עוגת מספר 10 מתוקה וחגיגית, מתאימה במיוחד לילדים.", buyCount: 12 },
    { name: "עוגיית שוקולד צ'יפס", categoryId: catMap[5], price: 26, image: "/images/choc-chip-cookie.jpg", description: "עוגיית שוקולד צ'יפס פריכה מבחוץ ורכה מבפנים, קלאסיקה אהובה.", buyCount: 23 },
    { name: "עוגת קומות קלאסית", categoryId: catMap[2], price: 160, image: "/images/tiered-classic-cake.jpg", description: "עוגת קומות קלאסית בעיצוב נקי וטעם עדין שמתאים לכל אירוע.", buyCount: 17 },
    { name: "עוגות מספר 50", categoryId: catMap[3], price: 260, image: "/images/Numbercake50.jpg", description: "עוגת מספר 50 חגיגית ומרשימה לציון יובל או יום הולדת עגול.", buyCount: 15 },
    { name: "עוגות מספר 8", categoryId: catMap[3], price: 170, image: "/images/Numbercake8.jpg", description: "עוגת מספר 8 מתוקה וצבעונית, מושלמת לילדים ולחגיגות קטנות.", buyCount: 24 },
    { name: "פאי תפוחים", categoryId: catMap[6], price: 120, image: "/images/apple-pie.jpg", description: "פאי תפוחים קלאסי עם קינמון ובצק פריך, בטעם ביתי ומנחם.", buyCount: 5 },
    { name: "עוגת קומות חתונה", categoryId: catMap[2], price: 250, image: "/images/tiered-wedding-cake.jpg", description: "עוגת חתונה אלגנטית ומרשימה, מעוצבת במיוחד ליום הגדול.", buyCount: 8 },
    { name: "עוגות מספר 65", categoryId: catMap[3], price: 280, image: "/images/Numbercake65.jpg", description: "עוגת מספר 65 חגיגית בעיצוב יוקרתי, לאירוע משמעותי.", buyCount: 4 },
    { name: "עוגיית חמאה", categoryId: catMap[5], price: 25, image: "/images/butter-cookie.jpg", description: "עוגיית חמאה פריכה ועדינה, פשוטה וטעימה.", buyCount: 12 },
    { name: "עוגות מספר 13", categoryId: catMap[3], price: 185, image: "/images/Numbercake13.jpg", description: "עוגת מספר 13 מעוצבת בקפידה עם מראה צעיר ושמח.", buyCount: 16 },
    { name: "עוגת קומות רוז", categoryId: catMap[2], price: 190, image: "/images/tiered-rose-cake.jpg", description: "עוגת קומות בגווני רוז רכים, רומנטית ואלגנטית.", buyCount: 30 },
    { name: "עוגות מספר 6", categoryId: catMap[3], price: 165, image: "/images/Numbercake6.jpg", description: "עוגת מספר 6 חמודה וצבעונית, מושלמת ליום הולדת לילדים.", buyCount: 10 },
    { name: "עוגות מספר 60", categoryId: catMap[3], price: 270, image: "/images/Numbercake60.jpg", description: "עוגת מספר 60 יוקרתית וחגיגית, לציון גיל משמעותי.", buyCount: 3 },
    { name: "עוגות מספר 23", categoryId: catMap[3], price: 190, image: "/images/Numbercake23.jpg", description: "עוגת מספר 23 בעיצוב מודרני עם טעמים אהובים.", buyCount: 4 },
    { name: "פאי לימון", categoryId: catMap[6], price: 90, image: "/images/lemon-pie.jpg", description: "פאי לימון רענן עם קרם חמצמץ ובצק פריך.", buyCount: 6 },
    { name: "עוגיות שוקולד אגוזים", categoryId: catMap[5], price: 40, image: "/images/chocolate-nut-cookies.jpg", description: "עוגיות שוקולד עם אגוזים קראנצ'יים, שילוב מושלם של טעמים.", buyCount: 8 },
    { name: "עוגת קומות יוקרתית", categoryId: catMap[2], price: 350, image: "/images/luxury-tiered-cake.jpg", description: "עוגת קומות יוקרתית במיוחד עם עיצוב מרהיב וטעם משובח.", buyCount: 12 },
    { name: "עוגת קומות וניל תות", categoryId: catMap[2], price: 230, image: "/images/tiered-vanilla-strawberry-cake.jpg", description: "עוגת קומות וניל ותות עם טעם רענן ומתוק.", buyCount: 17 },
    { name: "עוגת קומות שוקולד אגוזים", categoryId: catMap[2], price: 240, image: "/images/tiered-chocolate-nut-cake.jpg", description: "עוגת קומות שוקולד עשירה עם אגוזים קראנצ'יים.", buyCount: 15 },
    { name: "עוגת שוקולד לבן", categoryId: catMap[1], price: 170, image: "/images/white-chocolate-cake.jpg", description: "עוגת שוקולד לבן עדינה ומתוקה, בטעם קרמי ועשיר.", buyCount: 25 },
    { name: "סופלה וניל", categoryId: catMap[4], price: 50, image: "/images/vanilla-souffle.jpg", description: "סופלה וניל רך ואוורירי עם טעם עדין ומפנק.", buyCount: 22 },
    { name: "טירמיסו בכוס", categoryId: catMap[4], price: 45, image: "/images/tiramisu-cup.jpg", description: "טירמיסו אישי בכוס, נוח להגשה וטעים במיוחד.", buyCount: 19 },
    { name: "פאי פטל", categoryId: catMap[6], price: 68, image: "/images/raspberry-pie.jpg", description: "פאי פטל חמצמץ ומתוק עם צבע וטעם מודגשים.", buyCount: 9 },
    { name: "מקרונים פיסטוק", categoryId: catMap[4], price: 32, image: "/images/pistachio-macarons.jpg", description: "מקרונים במילוי פיסטוק עשיר, עדינים ויוקרתיים.", buyCount: 8 },
    { name: "עוגת קומות שוקולד בלגי", categoryId: catMap[2], price: 260, image: "/images/tiered-belgian-chocolate-cake.jpg", description: "עוגת קומות משוקולד בלגי איכותי, עשירה ועמוקה בטעם.", buyCount: 12 },
    { name: "עוגיות חמאת בוטנים", categoryId: catMap[5], price: 25, image: "/images/peanut-butter-cookies.jpg", description: "עוגיות חמאת בוטנים רכות עם טעם עמוק וממכר.", buyCount: 13 },
    { name: "עוגת תותים", categoryId: catMap[1], price: 96, image: "/images/strawberry-cake.jpg", description: "עוגת תותים רעננה ומתוקה עם קרם עדין.", buyCount: 18 },
    { name: "עוגת יום הולדת קומות", categoryId: catMap[2], price: 240, image: "/images/tiered-birthday-cake.jpg", description: "עוגת קומות חגיגית במיוחד לימי הולדת.", buyCount: 20 },
    { name: "עוגת שוקולד טבעונית", categoryId: catMap[1], price: 50, image: "/images/vegan-chocolate-cake.jpg", description: "עוגת שוקולד טבעונית עשירה וטעימה, ללא רכיבים מן החי.", buyCount: 17 },
    { name: "עוגת קומות קרמל מלוח", categoryId: catMap[2], price: 270, image: "/images/tiered-salted-caramel-cake.jpg", description: "עוגת קומות קרמל מלוח עם שילוב מושלם של מתוק ומלוח.", buyCount: 15 },
    { name: "עוגת לב", categoryId: catMap[1], price: 150, image: "/images/heart-cake.jpg", description: "עוגת לב מעוצבת באהבה, מושלמת לחגיגה מרגשת.", buyCount: 26 },
    { name: "פאי שוקולד", categoryId: catMap[6], price: 130, image: "https://www.metukimsheli.com/wp-content/uploads/2022/02/%D7%98%D7%90%D7%A8%D7%98-%D7%A0%D7%95%D7%98%D7%9C%D7%94.jpg", description: "פאי שוקולד טעים ויפיפה", buyCount: 6, userId: users[0]._id },
    { name: "עוגיות חמאה שקדים", categoryId: catMap[5], price: 80, image: "https://www.cookie-fairy.com/wp-content/uploads/2025/09/easy-butter-almond-cookies-1.jpg", description: "עוגיות חמאה ושקדים שנמסות בפה", buyCount: 5, userId: users[0]._id },
    { name: "עוגיות חמסה", categoryId: catMap[5], price: 60, image: "https://www.cookie-fairy.com/wp-content/uploads/2025/09/hamsa-cookies-1.jpg", description: "עוגיות חמסה מהממות", buyCount: 4, userId: users[0]._id },
    { name: "פאי ריבת חלב ופקאן", categoryId: catMap[6], price: 140, image: "https://www.cookie-fairy.com/wp-content/uploads/2025/07/mascarpone-dulce-de-leche-tart-5.jpg", description: "טארט מסקרפונה, ריבת חלב ופקאן (ללא אפייה)", buyCount: 3, userId: users[0]._id },
    { name: "פאי תותים", categoryId: catMap[6], price: 100, image: "https://www.cookie-fairy.com/wp-content/uploads/2025/05/strawberry-galette-1.jpg", description: "גאלט תותים וקרם שקדים", buyCount: 2, userId: users[0]._id },
    { name: "פאי אגסים קרם שקדים", categoryId: catMap[6], price: 90, image: "https://www.cookie-fairy.com/wp-content/uploads/2024/06/pear-almond-tart-1.jpg", description: "טארט אגסים קרם שקדים ושוקולד לבן", buyCount: 7, userId: users[0]._id },
    { name: "עוגיות בראוניז", categoryId: catMap[5], price: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-czNl7Z9qiZA-P9uvLqRWCeZ11dnwL3XCREe8sxSGCQEmy4jsBWWKC4&s", description: "עוגיות בראוניז מטריפות", buyCount: 5, userId: users[0]._id },
    { name: "עוגיות אלפחורס", categoryId: catMap[5], price: 40, image: "https://heninthekitchen.com/wp-content/uploads/2020/03/IMG_4312small.jpg", description: "עוגיות אלפחורס מושלמות נמסות בפה", buyCount: 4, userId: users[0]._id },
    { name: "קרמל קונפלקס", categoryId: catMap[5], price: 100, image: "https://adikosh.co.il/wp-content/uploads/2021/04/4A5DE14F-B083-4D04-A923-A0DDC534848B-2.jpg", description: "קרמל קונפלקס מתוק וטעים לא תרצו להפסיק לאכול", buyCount: 3, userId: users[0]._id },
    { name: "ופל בלגי", categoryId: catMap[4], price: 50, image: "https://img.mako.co.il/2018/02/08/belgwaffle_i.jpg", description: "ופל בלגי טעים ומושקע", buyCount: 8, userId: users[0]._id },
    { name: "נשיקות", categoryId: catMap[4], price: 40, image: "https://www.cookie-fairy.com/wp-content/uploads/2017/04/meringuekisses1.jpg", description: "נשיקות מושלמות", buyCount: 3, userId: users[0]._id },
  ];

  const products = await Product.insertMany(productsData);
  console.log(`✅ ${products.length} Products seeded`);

  // Seed some reviews
  const reviewsData = [
    { productId: products[0]._id, userId: users[1]._id, rating: 5, comment: "קניתי ליום הולדת הבת שלי והיא פשוט התלהבה! הקרם היה חלומי." },
    { productId: products[0]._id, userId: users[2]._id, rating: 4, comment: "טעים מאוד, אבל הקישוטים היו קצת שבורים בזמן ההגעה." },
    { productId: products[0]._id, userId: users[3]._id, rating: 5, comment: "העוגה נראתה כמו יצירת אומנות, טעים להפליא." },
    { productId: products[2]._id, userId: users[5]._id, rating: 5, comment: "המקרון נמס בפה, הכי טוב שאכלתי!" },
    { productId: products[2]._id, userId: users[6]._id, rating: 4, comment: "טעים מאוד, הצבעים ממש מקסימים." },
    { productId: products[3]._id, userId: users[7]._id, rating: 5, comment: "עוגת גבינה קלאסית, בדיוק מה שחיפשתי." },
    { productId: products[5]._id, userId: users[2]._id, rating: 5, comment: "רק טעמה וניחוח הקרם שווים הכל." },
    { productId: products[6]._id, userId: users[4]._id, rating: 5, comment: "עוגת שוקולד מושלמת! שכבות עשירות וממכרות." },
    { productId: products[13]._id, userId: users[8]._id, rating: 4, comment: "עוגת פירות מרעננת, יפה ומושכת את העין." },
    { productId: products[14]._id, userId: users[0]._id, rating: 5, comment: "טירמיסו אישי מדהים, קרמי ומושלם." },
    { productId: products[28]._id, userId: users[0]._id, rating: 5, comment: "עוגת קומות רוז רומנטית ומרשימה." },
    { productId: products[35]._id, userId: users[2]._id, rating: 5, comment: "עוגת קומות יוקרתית עם עיצוב מרהיב." },
    { productId: products[48]._id, userId: users[1]._id, rating: 5, comment: "עוגת לב מהממת יפה ומרגשת" },
  ];

  await Review.insertMany(reviewsData);
  console.log(`✅ Reviews seeded`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email: chen@example.com");
  console.log("   Password: Chen1234!");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
