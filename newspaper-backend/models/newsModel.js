const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Education", "Politics", "Sports"],
        required: true,
      },
    title: { type: String, required: true },
    media: { type: String }, // URL for image or video
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ["accept", "pending", "reject"],
        default: "pending",
    },
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
