import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.js";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId: string;
    };

    const user = await User.findById(decoded.userId); // Fetch the user from DB
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
