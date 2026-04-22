import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) { res.status(401).json({ message: "לא מורשה" }); return; }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "טוקן לא תקין" });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) { res.status(403).json({ message: "גישה מנהלים בלבד" }); return; }
  next();
};
