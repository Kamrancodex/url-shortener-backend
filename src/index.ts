import express from "express";
import { unregisteredLinkRouter } from "./routes/unregisteredLink.js";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import cors from "cors";
const MONGO_URI = process.env.MONGO_URI || "";

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

app.use(cors(corsOptions));

app.use("/api/v1", unregisteredLinkRouter);
app.use("/", unregisteredLinkRouter);
app.use("/api/v1", userRouter);
