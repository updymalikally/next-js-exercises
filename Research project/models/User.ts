import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });

export type UserRecord = InferSchemaType<typeof userSchema>;
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
