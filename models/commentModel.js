const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  createdByUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdOnPost: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  isHidden: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
});

// Virtual for comment's URL
CommentSchema.virtual("url").get(function () {
  return `/comment/${this._id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);
