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
import { nanoid } from "nanoid";
import RegisteredLink from "../models/registered.model.js";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (_) {
        return false;
    }
}
router.post("/registered-link", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    const userId = req.user.userId;
    if (!link || !isValidUrl(link)) {
        res.status(400).send("Please enter a valid link");
        return;
    }
    try {
        const shortCode = nanoid(7);
        const newLink = new RegisteredLink({
            user: userId,
            longUrl: link,
            shortCode,
        });
        yield newLink.save();
        const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
        res.status(201).json({ shortUrl });
    }
    catch (error) {
        console.error("Error creating registered link:", error);
        res.status(500).send("Internal Server Error");
    }
}));
router.get("/all-links", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Request received at /registered-links");
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log(userId);
        if (!userId) {
            res.status(401).json({ message: "User ID not found" });
            return;
        }
        const links = yield RegisteredLink.find({ user: userId });
        res.status(200).json({ links: links || [] });
    }
    catch (error) {
        console.error("Error retrieving registered links:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/:shortCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortCode } = req.params;
    try {
        const link = yield RegisteredLink.findOneAndUpdate({ shortCode }, { $inc: { visitCount: 1 } }, { new: true });
        if (!link) {
            res.status(404).send("Short URL not found");
            return;
        }
        res.redirect(link.longUrl);
    }
    catch (error) {
        console.error("Error finding short URL:", error);
        res.status(500).send("Internal Server Error");
    }
}));
router.delete("/registered-link/:shortCode", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortCode } = req.params;
    const userId = req.user.userId;
    try {
        const link = yield RegisteredLink.findOneAndDelete({
            shortCode,
            user: userId,
        });
        if (!link) {
            res.status(404).send("Short URL not found or not authorized to delete");
            return;
        }
        res.status(200).json({ message: "Link deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting registered link:", error);
        res.status(500).send("Internal Server Error");
    }
}));
export { router as registeredLinkRouter };
