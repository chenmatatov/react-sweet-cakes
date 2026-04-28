import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import { protect, adminOnly, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/products
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, search, sortBy, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter).populate("categoryId", "name");

    if (sortBy === "price_asc") query = query.sort({ price: 1 });
    else if (sortBy === "price_desc") query = query.sort({ price: -1 });
    else if (sortBy === "buyCount_desc") query = query.sort({ buyCount: -1 });
    else if (sortBy === "name_asc") query = query.sort({ name: 1 });
    else if (sortBy === "name_desc") query = query.sort({ name: -1 });

    const products = await query;
    res.json(products);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) { res.status(404).json({ message: "מוצר לא נמצא" }); return; }
    res.json(product);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// POST /api/products (admin only)
router.post("/", protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.create({ ...req.body, userId: req.user!.id });
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/products/:id/buycount
router.patch("/:id/buycount", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { buyCount: 1 } },
      { new: true }
    );
    if (!product) { res.status(404).json({ message: "מוצר לא נמצא" }); return; }
    res.json(product);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// DELETE /api/products/:id (admin only)
router.delete("/:id", protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) { res.status(404).json({ message: "מוצר לא נמצא" }); return; }
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
