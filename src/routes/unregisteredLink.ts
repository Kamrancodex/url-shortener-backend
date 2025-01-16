import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import UnregisteredLink from "../models/unregistered.js";

const router = Router();

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

router.post(
  "/unregistered-link",
  async (req: Request, res: Response): Promise<void> => {
    const { link } = req.body;

    if (!link || !isValidUrl(link)) {
      res.status(400).send("Please enter a valid link");
      return;
    }

    try {
      const shortCode = nanoid(7);

      const newLink = new UnregisteredLink({ longUrl: link, shortCode });
      console.log(newLink);

      await newLink.save();

      const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

     
      const qrCode = await QRCode.toDataURL(shortUrl);

      res.status(201).json({
        shortUrl,
        qrCode, 
      });
    } catch (error) {
      console.error("Error shortening link:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/:shortCode",
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params;

    try {
      const link = await UnregisteredLink.findOne({ shortCode });

      if (!link) {
        res.status(404).send("Short URL not found");
        return;
      }

      res.redirect(link.longUrl);
    } catch (error) {
      console.error("Error finding short URL:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export { router as unregisteredLinkRouter };
