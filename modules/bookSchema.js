const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB connected succesfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
  


const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    author: { type: String, required: true, index: true },
    publishDate: { type: Date }
  },
  { timestamps: true }
);

// Text search index
bookSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Book", bookSchema);

