var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.js";
import RegisteredLink from "../models/registered.model.js";
import mongoose from "mongoose";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// Signup with email and password
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !passport) {
        res.status(400).json({ message: "Enter all fields" });
        return;
    }
    try {
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        yield newUser.save();
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ token, user: { email: newUser.email } });
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
}));
// Google OAuth login
router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
});
router.get("/user-info", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userInfo = yield User.findById(user.userId).select("-password");
        if (!userInfo) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user: userInfo });
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
        expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
});
router.get("/user-total-visits", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    try {
        const totalVisits = yield RegisteredLink.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$user", totalVisits: { $sum: "$visitCount" } } },
        ]);
        if (!totalVisits.length) {
            res.status(404).json({ message: "No links found for this user" });
            return;
        }
        res.status(200).json({ totalVisits: totalVisits[0].totalVisits });
    }
    catch (error) {
        console.error("Error calculating total visits:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/user-links-with-visits", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    try {
        const links = yield RegisteredLink.find({ user: userId }).select("longUrl shortCode visitCount createdAt");
        if (!links.length) {
            res.status(404).json({ message: "No links found for this user" });
            return;
        }
        res.status(200).json({ links });
    }
    catch (error) {
        console.error("Error fetching user links with visits:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     // Successfully authenticated, redirect or respond
//     const user = req.user; // Get the user from the request
//     res.redirect("/dashboard"); // Redirect to a dashboard or another page
//   }
// );
export { router as userRouter };
