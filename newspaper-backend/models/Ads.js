const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    // required fields
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String, required: true }, // Store image URL or path
    link: { type: String, required: true }, // URL where ad redirects
    
    // not required fields
    active: { type: Boolean, default: true }, // Whether ad is currently active
    impressions: { type: Number, default: 0 }, // Number of times ad was shown
    clicks: { type: Number, default: 0 }, // Number of clicks
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);