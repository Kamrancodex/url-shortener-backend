
import mongoose, { Schema, Document } from "mongoose";

export interface IRegisteredLink extends Document {
  user: mongoose.Types.ObjectId;
  longUrl: string;
  shortCode: string;
  visitCount: number;
  createdAt: Date;
}

const RegisteredLinkSchema = new Schema<IRegisteredLink>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const RegisteredLink = mongoose.model<IRegisteredLink>(
  "RegisteredLink",
  RegisteredLinkSchema
);

export default RegisteredLink;
