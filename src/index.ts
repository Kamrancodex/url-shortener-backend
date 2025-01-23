import express from "express";
import { unregisteredLinkRouter } from "./routes/unregisteredLink.js";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import cors from "cors";
import { registeredLinkRouter } from "./routes/registeredLink.js";
import passport from "passport";
import "./config/passport.js"; // Or wherever your Google strategy is configured
import session from "express-session";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitvlogs02:RwH0X8bJF3IpfoxL@cluster0.lhw3atd.mongodb.net/shortner";

const app = express();
app.use(express.json());
const PORT = 3000;
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(
  session({
    secret: "your_secret_key", // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session()); // Only if you are using sessions
// Moved specific routes before the catch-all routes
app.use("/api/v1", registeredLinkRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", unregisteredLinkRouter);
app.use("/", unregisteredLinkRouter);
app.use("/", registeredLinkRouter);
