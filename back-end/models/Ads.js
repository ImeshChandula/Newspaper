const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    // required fields
    title: { type: String },
    content: { type: String },
    media: { type: String }, // Store image URL or path
    link: { type: String }, // URL where ad redirects
    phoneNumber: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // not required fields
    active: { type: Boolean, default: false }, // Whether ad is currently active
    impressions: { type: Number, default: 0 }, // Number of times ad was shown
    clicks: { type: Number, default: 0 }, // Number of clicks
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
}, { timestamps: true });


// Create a static method to manually update expired ads
adSchema.statics.updateExpiredAds = function() {
    const currentDate = new Date();
    return this.updateMany(
      { 
        active: true, 
        endDate: { $lt: currentDate }
      },
      { 
        active: false 
      }
    );
  };


module.exports = mongoose.model("Ads", adSchema);