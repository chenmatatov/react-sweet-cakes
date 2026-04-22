import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  image: string;
  description: string;
  buyCount: number;
  userId?: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "/images/defultCake.png" },
    description: { type: String, default: "" },
    buyCount: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
