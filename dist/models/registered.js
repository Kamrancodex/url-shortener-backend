import mongoose, { Schema } from "mongoose";
const RegisteredLinkSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    visitCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
const RegisteredLink = mongoose.model("RegisteredLink", RegisteredLinkSchema);
export default RegisteredLink;
