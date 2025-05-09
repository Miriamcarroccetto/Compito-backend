import express from "express";
const router = express.Router()

import Author from "../models/authorSchema.js";

router.get('/', (req, res)=> {
    return res.status(200).json({message: "Hello World"})
})









export default router