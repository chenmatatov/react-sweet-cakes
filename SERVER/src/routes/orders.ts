import { Router, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth";
import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; name: string; price: number; quantity: number }[];
  shipping: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; zip: string };
  totalPrice: number;
  status: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }],
    shipping: {
      firstName: String, lastName: String, email: String,
      phone: String, address: String, city: String, zip: String,
    },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending", enum: ["pending", "confirmed", "shipped", "delivered"] },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

const router = Router();

// POST /api/orders
router.post("/", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shipping, totalPrice } = req.body;
    const order = await Order.create({ userId: req.user!.id, items, shipping, totalPrice });
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get("/my", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .populate("items.productId", "image")
      .sort({ createdAt: -1 });

    const result = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map((item: any) => ({
        ...item.toObject(),
        image: item.image || item.productId?.image || "",
      }))
    }));

    res.json(result);
  } catch {
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
