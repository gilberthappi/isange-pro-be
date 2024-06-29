import mongoose from "mongoose";
const blogSchema = mongoose.Schema({


    blogTitle: String,
    typeOfBlog: String,
    location: String,
    photo: [String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      description: {
        type: String,
        maxlength: 2000,
      },
      duration: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});
export const Blog =mongoose.model("Blog", blogSchema);


