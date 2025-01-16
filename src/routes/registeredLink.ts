import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import RegisteredLink from "../models/registered";
import { authMiddleware } from "../middleware/auth";

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
  "/registered-link",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { link } = req.body;
    const userId = (req as any).user.userId;

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

      await newLink.save();

      const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
      res.status(201).json({ shortUrl });
    } catch (error) {
      console.error("Error creating registered link:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/registered-links",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.userId;

    try {
      const links = await RegisteredLink.find({ user: userId });
      res.status(200).json(links);
    } catch (error) {
      console.error("Error retrieving registered links:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/:shortCode",
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params;

    try {
      const link = await RegisteredLink.findOneAndUpdate(
        { shortCode },
        { $inc: { visitCount: 1 } },
        { new: true }
      );

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

router.delete(
  "/registered-link/:shortCode",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params;
    const userId = (req as any).user.userId;

    try {
      const link = await RegisteredLink.findOneAndDelete({
        shortCode,
        user: userId,
      });

      if (!link) {
        res.status(404).send("Short URL not found or not authorized to delete");
        return;
      }

      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      console.error("Error deleting registered link:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export { router as registeredLinkRouter };
