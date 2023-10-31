const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdDate: { type: Date, required: true },
  createdOnPost: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdByUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isVisible: { type: Boolean },
});

// Virtual for comment's URL
CommentSchema.virtual("url").get(function () {
  return `/comment/${this._id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);
