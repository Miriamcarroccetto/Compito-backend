import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    username: {type: String, required: true },
    text: {type: String, require: true},
    date: {type: Date, default: Date.now}
})

const blogPostSchema = new mongoose.Schema ({
    category: {type: String , required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value:{type:Number,required:true}, 
        unit: {type:String,required:true} 
     
},
    author: {type: String, required: true},
    comments: [commentSchema]
})

const Blogpost = mongoose.model ('Blogpost', blogPostSchema)

export default Blogpost