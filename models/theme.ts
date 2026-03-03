import mongoose, { Schema, models, model } from "mongoose"

const ThemeSchema = new Schema({
  name: {
    type: String,
    default: "Custom Theme",
  },
  primary: {
    type: String,
    default: "#00E5FF",
  },
  secondary: {
    type: String,
    default: "#8B5CF6",
  },
  accent: {
    type: String,
    default: "#F59E0B",
  },
  background: {
    type: String,
    default: "#0D1117",
  },
  surface: {
    type: String,
    default: "#1F2937",
  },
  text: {
    type: String,
    default: "#ffffff",
  },
  fontHeading: {
    type: String,
    default: "Inter",
  },
  fontBody: {
    type: String,
    default: "Inter",
  },
  borderRadius: {
    type: Number,
    default: 12,
  },
  animations: {
    type: Boolean,
    default: true,
  },
  darkMode: {
    type: String,
    enum: ["dark", "light", "system"],
    default: "dark",
  },
  logo: {
    type: String,
    default: "",
  },
  favicon: {
    type: String,
    default: "",
  },
  customPalettes: {
    type: [{
      name: { type: String, required: true },
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: { type: String, required: true },
      background: { type: String, required: true },
    }],
    default: [],
  },
  updatedAt: { type: Date, default: Date.now },
})

export const Theme = models.Theme || model("Theme", ThemeSchema)
