import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, city } = req.body;

    const existing = await User.findOne({ email });
    if (existing) { res.status(400).json({ message: "אימייל כבר קיים במערכת" }); return; }

    const user = await User.create({ name, email, password, phone, city });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) { res.status(400).json({ message: "אימייל או סיסמה לא נכונים" }); return; }

    const match = await user.comparePassword(password);
    if (!match) { res.status(400).json({ message: "אימייל או סיסמה לא נכונים" }); return; }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) { res.status(404).json({ message: "משתמש לא נמצא" }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// PUT /api/auth/me
router.put("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, city, password } = req.body;
    const user = await User.findById(req.user!.id);
    if (!user) { res.status(404).json({ message: "משתמש לא נמצא" }); return; }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (password) user.password = password;

    await user.save();

    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, isAdmin: user.isAdmin });
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
