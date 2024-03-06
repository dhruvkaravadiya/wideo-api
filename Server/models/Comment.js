const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoId:{
        type:String,
        required:true
    }
  },
  { timestamps: true ,versionKey:false}
);

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;