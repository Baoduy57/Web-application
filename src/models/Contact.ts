// models/Contact.ts
import mongoose, { Schema } from "mongoose";

export interface IContact {
  name: string;
  email: string;
  phone?: string;
  group?: "Friends" | "Work" | "Family" | "Other";
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      match: /\S+@\S+\.\S+/,
      maxlength: 100,
    },
    phone: { type: String, maxlength: 10 },
    group: {
      type: String,
      enum: ["Friends", "Work", "Family", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
