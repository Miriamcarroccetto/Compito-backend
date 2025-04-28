import mongoose from "mongoose";

const authorSchema = new mongoose.Schema ({
    name: {type: String , required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    birthday: {type: String, required: true},
    avatar: {type: String, required: true}
})

const Author = mongoose.model ('Author', authorSchema)

export default Author