import { Router, Request, Response } from "express";
import { Category } from "../models/Product";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
