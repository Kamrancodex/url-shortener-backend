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
import QRCode from "qrcode";
import UnregisteredLink from "../models/unregistered.js";
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
router.post("/unregistered-link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    if (!link || !isValidUrl(link)) {
        res.status(400).send("Please enter a valid link");
        return;
    }
    try {
        const shortCode = nanoid(7);
        const newLink = new UnregisteredLink({ longUrl: link, shortCode });
        console.log(newLink);
        yield newLink.save();
        const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
        const qrCode = yield QRCode.toDataURL(shortUrl);
        res.status(201).json({
            shortUrl,
            qrCode,
        });
    }
    catch (error) {
        console.error("Error shortening link:", error);
        res.status(500).send("Internal Server Error");
    }
}));
router.get("/:shortCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortCode } = req.params;
    try {
        const link = yield UnregisteredLink.findOne({ shortCode });
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
export { router as unregisteredLinkRouter };
