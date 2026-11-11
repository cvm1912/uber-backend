const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema(
  {
    // Step 1: Phone Authentication
    countryCode: {
      type: String,
      required: [true, "Country code is required"],
      trim: true,
      match: [/^\+\d{1,4}$/, "Country code must be in format +91"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{7,15}$/, "Phone number must be between 7 and 15 digits"],
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // Step 2: Basic Profile
    firstName: {
      type: String,
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      default: null,
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
      default: null,
    },

    isAdult: {
      type: Boolean,
      default: null,
    },

    // Step 3: Optional Profile Information
    profilePicture: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Profile picture must be a valid URL"],
      default: null,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", null],
        message: "Gender must be male, female, or other",
      },
      default: null,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      default: null,
    },

    language: {
      type: String,
      trim: true,
      match: [/^[a-z]{2}(-[A-Z]{2})?$/, "Language must be a valid ISO code e.g. en, hi, en-US"],
      default: "en",
    },

    // Account Status
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique phone number with country code
riderSchema.index(
  { countryCode: 1, phone: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rider", riderSchema);
