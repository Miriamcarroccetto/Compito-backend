import Author from '../models/authorSchema.js'
import mongoose from 'mongoose';


export const validateAuthorId = async (req, res, next) => {
    const authorId = req.user?._id

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({ error: 'ID autore non corretto' })
    }

    try {
        const authorExists = await Author.findById(authorId)
        if (!authorExists) {
            return res.status(404).json({ error: 'Autore non trovato' })
        }

        next()
    } catch (err) {
        return res.status(500).json({ error: 'Errore lato server' });
    }
};
