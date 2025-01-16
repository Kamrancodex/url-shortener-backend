import mongoose from "mongoose";

const UnregisteredLinkSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const UnregisteredLink = mongoose.model(
  "UnregisteredLink",
  UnregisteredLinkSchema
);

export default UnregisteredLink;
