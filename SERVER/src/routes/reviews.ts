import { Router, Request, Response } from "express";
import Review from "../models/Review";
import { protect, adminOnly, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/reviews?productId=xxx
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter)
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// POST /api/reviews
router.post("/", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;

    const existing = await Review.findOne({ productId, userId: req.user!.id });
    if (existing) { res.status(400).json({ message: "כבר כתבת ביקורת למוצר זה" }); return; }

    const review = await Review.create({ productId, userId: req.user!.id, rating, comment });
    const populated = await review.populate("userId", "name");
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) { res.status(404).json({ message: "ביקורת לא נמצאה" }); return; }

    const isOwner = review.userId.toString() === req.user!.id;
    if (!isOwner && !req.user!.isAdmin) {
      res.status(403).json({ message: "אין הרשאה למחוק ביקורת זו" }); return;
    }

    await review.deleteOne();
    res.json({ message: "הביקורת נמחקה" });
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
