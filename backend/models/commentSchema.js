import mongoose from "mongoose";

 export const commentSchema = new mongoose.Schema({
    username: {type: String, required: true },
    text: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

const Comment = mongoose.model ('Comment', commentSchema)

export default Comment