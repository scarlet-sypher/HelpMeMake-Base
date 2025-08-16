const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Professional Profile
    title: {
      type: String,
      default: "Software Engineer", // Professional title/designation
      required: true,
    },
    description: {
      type: String,
      default: "Passionate about helping others learn and grow",
      required: true,
    },
    bio: {
      type: String,
      default: "Experienced professional ready to share knowledge",
      maxlength: 1000,
    },
    location: {
      type: String,
      default: "Remote",
      required: true,
    },

    // Professional Details
    experience: {
      years: {
        type: Number,
        default: 0,
        min: 0,
      },
      companies: [
        {
          name: String,
          position: String,
          duration: String,
          description: String,
        },
      ],
    },

    // Expertise & Skills
    expertise: [
      {
        skill: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
        yearsOfExperience: {
          type: Number,
          default: 0,
        },
      },
    ],

    specializations: [
      {
        type: String,
        trim: true,
      },
    ],

    // Status & Availability
    isOnline: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },

    // Ratings & Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
    totalReviews: {
      type: Number,
      default: 0,
      required: true,
    },

    // Social Links
    socialLinks: {
      linkedin: { type: String, default: "#" },
      github: { type: String, default: "#" },
      twitter: { type: String, default: "#" },
      portfolio: { type: String, default: "#" },
      blog: { type: String, default: "#" },
    },

    // Session & Engagement Metrics
    completedSessions: {
      type: Number,
      default: 0,
      required: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
      required: true,
    },
    responseTime: {
      type: Number, // in minutes
      default: 30,
      required: true,
    },

    // Achievement & Recognition
    badges: [
      {
        name: String,
        description: String,
        earnedDate: {
          type: Date,
          default: Date.now,
        },
        icon: String,
      },
    ],

    achievements: {
      type: Number,
      default: 0,
      required: true,
    },

    // Pricing & Availability
    pricing: {
      hourlyRate: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      freeSessionsOffered: {
        type: Number,
        default: 1,
      },
    },

    availability: {
      timezone: {
        type: String,
        default: "UTC",
      },
      weeklyHours: [
        {
          day: {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
          startTime: String, // HH:MM format
          endTime: String, // HH:MM format
          available: Boolean,
        },
      ],
    },

    // Mentor Dashboard Stats
    mentorActiveStudents: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorActiveStudentsChange: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorSessionsCompleted: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorSessionsCompletedChange: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorTotalEarnings: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorTotalEarningsChange: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorSatisfactionRate: {
      type: Number,
      default: 0,
      required: true,
    },
    mentorSatisfactionRateChange: {
      type: Number,
      default: 0,
      required: true,
    },

    // Session History & Reviews
    sessionHistory: [
      {
        learnerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sessionDate: Date,
        topic: String,
        duration: Number, // in minutes
        rating: Number,
        feedback: String,
        earnings: Number,
      },
    ],

    reviews: [
      {
        learnerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Profile Verification
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationLevel: {
        type: String,
        enum: ["none", "email", "phone", "identity", "professional"],
        default: "none",
      },
      documents: [
        {
          type: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
          },
        },
      ],
    },

    // Teaching Preferences
    teachingPreferences: {
      maxStudentsPerSession: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      sessionTypes: [
        {
          type: String,
          enum: ["one-on-one", "group", "workshop", "code-review"],
        },
      ],
      preferredTopics: [
        {
          type: String,
        },
      ],
      languages: [
        {
          type: String,
          default: "English",
        },
      ],
    },

    // Onboarding & Status
    joinDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    profileCompleteness: {
      type: Number,
      default: 20, // percentage
      min: 0,
      max: 100,
    },
    isPasswordUpdated: {
      type: Boolean,
      default: false,
    },

    // Notifications & Preferences
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sessionRequests: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      marketingUpdates: { type: Boolean, default: false },
      profileUpdates: { type: Boolean, default: true },
      socialLinkUpdates: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
// mentorSchema.index({ userId: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ "expertise.skill": 1 });
mentorSchema.index({ isAvailable: 1 });
mentorSchema.index({ joinDate: -1 });
mentorSchema.index({ "pricing.hourlyRate": 1 });

// Virtual for average rating calculation
mentorSchema.virtual("averageRating").get(function () {
  if (!Array.isArray(this.reviews) || this.reviews.length === 0)
    return this.rating;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});
// Virtual for success rate
mentorSchema.virtual("successRate").get(function () {
  if (this.completedSessions === 0) return 0;
  return Math.floor(
    (this.completedSessions / (this.completedSessions + 5)) * 100
  ); // Assuming some incomplete sessions
});

// Virtual for expertise summary
mentorSchema.virtual("primaryExpertise").get(function () {
  if (!Array.isArray(this.expertise) || this.expertise.length === 0) return [];
  return this.expertise
    .filter((exp) => exp.level === "expert" || exp.level === "advanced")
    .map((exp) => exp.skill)
    .slice(0, 3);
});

// Method to calculate profile completeness
mentorSchema.methods.calculateProfileCompleteness = function () {
  let completeness = 20; // Base for having a profile

  if (this.bio && this.bio.length > 50) completeness += 15;
  if (this.expertise.length > 0) completeness += 20;
  if (this.experience.companies.length > 0) completeness += 15;
  if (this.socialLinks.linkedin !== "#") completeness += 10;
  if (this.pricing.hourlyRate > 0) completeness += 10;
  if (this.availability.weeklyHours.length > 0) completeness += 10;

  this.profileCompleteness = Math.min(completeness, 100);
  return this.profileCompleteness;
};

mentorSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Mentor", mentorSchema);
