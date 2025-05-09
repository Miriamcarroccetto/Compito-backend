import mongoose from "mongoose";
import {commentSchema}  from "./commentSchema.js";

const blogPostSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      type: new mongoose.Schema({
        value: { type: Number, required: true },
        unit: { type: String, required: true }
      }, { _id: false }) 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
     },
    comments: [commentSchema]
  })
  

const Blogpost = mongoose.model ('Blogpost', blogPostSchema)

export default Blogpost