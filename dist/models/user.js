import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: "Invalid email format",
        },
    },
    password: { type: String, select: false },
    googleId: { type: String, index: true },
    githubId: { type: String, index: true },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
export default User;
