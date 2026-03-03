import mongoose, { Schema, models, model } from "mongoose"

const ProfileSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [100, "Name cannot exceed 100 characters"],
    default: "",
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title cannot exceed 100 characters"],
    default: "",
    trim: true,
  },
  bio: {
    type: String,
    maxlength: [1000, "Bio cannot exceed 1000 characters"],
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    maxlength: [100, "Location cannot exceed 100 characters"],
    default: "",
  },
  timezone: {
    type: String,
    default: "Africa/Algiers",
    enum: [
      "Africa/Algiers", "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg",
      "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
      "America/Sao_Paulo", "America/Mexico_City",
      "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Singapore", "Asia/Hong_Kong",
      "Asia/Tokyo", "Asia/Seoul",
      "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
      "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland", "UTC",
    ],
  },
  email: {
    type: String,
    maxlength: [100, "Email cannot exceed 100 characters"],
    match: [/^\S*@\S*\.\S*$/, "Please enter a valid email"],
    default: "",
  },
  phone: {
    type: String,
    maxlength: [20, "Phone cannot exceed 20 characters"],
    default: "",
  },
  skills: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 20 && v.every(s => s.length <= 50)
      },
      message: "Maximum 20 skills, each up to 50 characters"
    },
    default: [],
  },
  achievements: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10 && v.every(s => s.length <= 300)
      },
      message: "Maximum 10 achievements, each up to 300 characters"
    },
    default: [],
  },
  techStack: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 30 && v.every(s => s.length <= 30)
      },
      message: "Maximum 30 technologies, each up to 30 characters"
    },
    default: [],
  },
  socialLinks: {
    type: [{
      platform: { type: String, required: true },
      username: { type: String, default: "" },
      url: { type: String, default: "" },
      enabled: { type: Boolean, default: true },
      icon: { type: String, default: "" },
    }],
    default: [],
  },
  siteVersion: {
    type: String,
    maxlength: [20, "Version cannot exceed 20 characters"],
    default: "v2024.1.0-alpha",
  },
  showHero: { type: Boolean, default: true },
  showProfileCard: { type: Boolean, default: true },
  showAbout: { type: Boolean, default: true },
  showTerminal: { type: Boolean, default: true },
  showToolbox: { type: Boolean, default: true },
  showFeaturedProjects: { type: Boolean, default: true },
  showRecentArticles: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
})

export const Profile = models.Profile || model("Profile", ProfileSchema)
