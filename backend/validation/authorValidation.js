import Author from '../models/authorSchema.js'
import mongoose from 'mongoose';


export const validateAuthorId = async (req, res, next) => {
    const { author } = req.body

    if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ error: 'Invalid author ID format' })
    }

    try {
        const authorExists = await Author.findById(author)
        if (!authorExists) {
            return res.status(404).json({ error: 'Author not found' })
        }

        next()
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
