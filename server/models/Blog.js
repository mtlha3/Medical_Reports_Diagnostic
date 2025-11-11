const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: { type: String, unique: true, sparse: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String },
  date: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  blogId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  typeOfBlog: {
    type: String,
    enum: ["healthTips", "information", "story"],
    default: "information",
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  comments: [commentSchema],
});

module.exports = mongoose.model("Blog", blogSchema);
