import mongoose, { Schema, type InferSchemaType } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: "", trim: true, maxlength: 1200 },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo", index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });

export type TaskRecord = InferSchemaType<typeof taskSchema>;
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
