const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Education", "Politics", "Sports"],
        required: true,
      },
    breakingNews: { type: Boolean, default: false},
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
},  { timestamps: true });



// Create a static method to manually update breaking news
newsSchema.statics.updateBreakingNews = function() {
    // Calculate the date 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return this.updateMany(
        { 
          breakingNews: true,
          date: { $lt: twentyFourHoursAgo }
        },
        { 
          $set: { breakingNews: false } 
        }
      );
};

module.exports = mongoose.model('News', newsSchema);
