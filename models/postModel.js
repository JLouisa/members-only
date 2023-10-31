const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdDate: { type: Date, required: true },
  createdByUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isVisible: { type: Boolean },
});

// Virtual for post's URL
PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
