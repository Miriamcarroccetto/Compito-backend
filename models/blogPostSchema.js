import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema ({
    category: {type: String , required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value:{
            type:Number,
            required:true
    }, 
    unit: {
        type:Number,
        required:true
       } 
     
},
    authorSchema: {type: String, required: true}
})

const Blogpost = mongoose.model ('Blogpost', blogPostSchema)

export default Blogpost