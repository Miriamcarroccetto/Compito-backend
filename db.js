import "dotenv/config";
import mongoose from "mongoose";

const db = async ()=> {
    try {
        await mongoose.connect (process.env.MONGO_URI)
        console.log('MongoDB connected')

    } catch (err) {
        console.log('MongoDB connection error'+ err)
    }
}

export default db