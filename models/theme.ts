import mongoose, { Schema, models, model } from "mongoose"

const ThemeSchema = new Schema({
  name: {
    type: String,
    default: "Custom Theme",
  },
  // Dark mode colors (default)
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
  // Light mode colors
  lightPrimary: {
    type: String,
    default: "#0891B2",
  },
  lightSecondary: {
    type: String,
    default: "#7C3AED",
  },
  lightAccent: {
    type: String,
    default: "#D97706",
  },
  lightBackground: {
    type: String,
    default: "#F8FAFC",
  },
  lightSurface: {
    type: String,
    default: "#FFFFFF",
  },
  lightText: {
    type: String,
    default: "#0F172A",
  },
  fontHeading: {
    type: String,
    default: "Inter",
  },
  fontBody: {
    type: String,
    default: "Inter",
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  borderRadius: {
    type: String,
    default: "rounded-xl",
  },
  borderWidth: {
    type: Number,
    default: 1,
  },
  iconStyle: {
    type: String,
    default: "rounded",
  },
  layout: {
    type: String,
    default: "default",
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
  // Page Style Presets (Material, Bento, Minimalist, Neo-Brutalist, etc.)
  pageStyle: {
    type: String,
    default: "default",
  },
  // Component Style (for buttons, cards, inputs)
  componentStyle: {
    type: String,
    default: "rounded",
  },
  // Card style
  cardStyle: {
    type: String,
    default: "default",
  },
  // Button style
  buttonStyle: {
    type: String,
    default: "default",
  },
  // Input style
  inputStyle: {
    type: String,
    default: "default",
  },
  // Shadow intensity (none, light, medium, heavy)
  shadowIntensity: {
    type: String,
    default: "medium",
  },
  // Border style (none, solid, dashed, dotted)
  borderStyle: {
    type: String,
    default: "solid",
  },
  // Background settings
  backgroundStyle: {
    type: String,
    default: "gradient",
  },
  backgroundImage: {
    type: String,
    default: "",
  },
  backgroundVideo: {
    type: String,
    default: "",
  },
  // Animation settings
  animationStyle: {
    type: String,
    default: "rattle",
  },
  textAnimationStyle: {
    type: String,
    default: "none",
  },
  cardGlow: {
    type: Number,
    default: 0,
  },
  textGlow: {
    type: Number,
    default: 0,
  },
  customPalettes: {
    type: [{
      name: { type: String, required: true },
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: { type: String, required: true },
      background: { type: String, required: true },
      surface: { type: String, required: true },
      text: { type: String, required: true },
      lightPrimary: { type: String },
      lightSecondary: { type: String },
      lightAccent: { type: String },
      lightBackground: { type: String },
      lightSurface: { type: String },
      lightText: { type: String },
    }],
    default: [],
  },
  customLayouts: {
    type: [{
      name: { type: String, required: true },
      borderRadius: { type: String, required: true },
      borderWidth: { type: Number, required: true },
      iconStyle: { type: String, required: true },
      layout: { type: String, required: true },
    }],
    default: [],
  },
  // Custom style presets created by user
  customStyles: {
    type: [{
      name: { type: String, required: true },
      pageStyle: { type: String },
      componentStyle: { type: String },
      cardStyle: { type: String },
      buttonStyle: { type: String },
      inputStyle: { type: String },
      borderRadius: { type: String },
      borderWidth: { type: Number },
      borderStyle: { type: String },
      shadowIntensity: { type: String },
    }],
    default: [],
  },
  updatedAt: { type: Date, default: Date.now },
})

export const Theme = models.Theme || model("Theme", ThemeSchema)
