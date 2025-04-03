const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String }, // URL of image/video
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("News", newsSchema);
const News = mongoose.model("News", newsSchema);
module.exports = News;
