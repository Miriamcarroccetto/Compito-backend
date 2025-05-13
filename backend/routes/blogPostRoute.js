import express from "express";
import Blogpost from "../models/blogPostSchema.js";
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { validateAuthorId } from "../middlewares/authorValidation.js";
import authMiddleware from '../middlewares/authMiddleware.js'
import checkOwnership from '../middlewares/checkOwnership.js'
import { blogPostValidationRules, validateBlogPost } from '../middlewares/blogPostValidation.js'

import 'dotenv/config'


const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blogPost',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => `avatar-${Date.now()}`
    }
})

const upload = multer({ storage })

// BLOGPOSTS

//GET TUTTI BLOGPOSTS
router.get('/', authMiddleware, async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query
    try {
        const blogPosts = await Blogpost.find()
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate("author", "name lastName avatar")

        const total = await Blogpost.countDocuments()


        res.json({
            total,
            page: parseInt(page),
            totalePages: Math.ceil(total / limit),
            blogPosts
        })

    } catch (err) {
        next(err)
    }
})


// GET BLOGPOST SPECIFICO
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
            .populate("author", "name lastName avatar")

        if (!blogPost) return res.status(404).json({ error: "Blogpost not found" })
        res.send(blogPost)
    } catch (err) {
        next(err)
    }

})


//POST BLOGPOST
router.post('/', authMiddleware, blogPostValidationRules, validateBlogPost, validateAuthorId, async (req, res, next) => {
    console.log("Dati ricevuti nel body:", req.body);
    console.log("Utente autenticato:", req.user?._id);

    const { category, title, cover, content, readTime } = req.body
    const author = req.user._id
    try {
        const newBlogPost = new Blogpost({
            category,
            title,
            cover,
            content,
            readTime,
            author
        })
        await newBlogPost.save()

        res.status(201).json(newBlogPost)
    } catch (err) {
        console.log("Errore creazione post:", err)
        next(err)
    }

})

//PUT BLOGPOST SPECIFICO
router.put('/:id', authMiddleware, checkOwnership, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate("author", "name lastName avatar")
        if (!blogPost) {
            return res.status(404).json({ error: 'Blogpost not found' })
        }
        res.status(200).json(blogPost)

    } catch (err) {
        next(err)
    }
})

//PATCH COVER SPECIFICO BLOGPOST
router.patch('/:id/cover', authMiddleware, upload.single('cover'), async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findByIdAndUpdate(
            req.params.id,
            { cover: req.file.path },
            { new: true }
        )
        if (!blogPost) return res.status(404).json({ error: 'Blogpost not found' })
        res.status(200).json(blogPost)
    } catch (err) {
        next(err)
    }
})

//DELETE SPECIFICO BLOGPOST
router.delete('/:id', authMiddleware, checkOwnership, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findByIdAndDelete(req.params.id)
        if (!blogPost) return res.status(404).json({ error: 'Blogpost not found' })
        res.status(200).json({ message: 'Blogpost deleted' })
    } catch (err) {
        next(err)
    }
})

//COMMENTS


//GET TUTTI COMMENTS DI UN BLOGPOST
router.get('/:id/comments', authMiddleware, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
        if (!blogPost) {
            return res.status(404).json({ error: "Blogpost not found" })
        }
        res.status(200).json(blogPost.comments)
    } catch (err) {
        next(err)
    }
})

//GET COMMENTO DI UN BLOGPOST
router.get('/:id/comments/:commentId', authMiddleware, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
        if (!blogPost) {
            return res.status(404).json({ error: "Blogpost not found" })
        }

        const comment = blogPost.comments.id(req.params.commentId)
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" })
        }

        res.status(200).json(comment)

    } catch (err) {
        next(err)
    }
})

//POST COMMENTO

router.post('/:id/comments', authMiddleware, async (req, res, next) => {
    try {
        const { username, text } = req.body
        const blogPost = await Blogpost.findById(req.params.id)

        if (!blogPost) {
            return res.status(404).json({ error: "Blogpost not found" })
        }
        const newComment = { username, text }
        blogPost.comments.push(newComment)
        await blogPost.save()

        res.status(201).json(blogPost.comments[blogPost.comments.length - 1])
    } catch (err) {
        next(err)
    }
})

//MODIFICA COMMENT0
router.put('/:id/comments/:commentId', authMiddleware, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
        if (!blogPost) return res.status(404).json({ error: "Blogpost not found" })

        const comment = blogPost.comments.id(req.params.commentId)
        if (!comment) return res.status(404).json({ error: "Comment not found" })

        if (req.body.username) comment.username = req.body.username
        if (req.body.text) comment.text = req.body.text

        await blogPost.save()
        res.status(200).json(comment)

    } catch (err) {
        next(err)
    }
})

//ELIMINA COMMENTO
router.delete('/:id/comments/:commentId', authMiddleware, async (req, res, next) => {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
        if (!blogPost) return res.status(404).json({ error: "Blogpost not found" })

        const comment = blogPost.comments.id(req.params.commentId)
        if (!comment) return res.status(404).json({ error: "Comment not found" })

        comment.remove()
        await blogPost.save()

        res.status(200).json({ message: "Comment deleted" })
    } catch (err) {
        next(err)
    }
})



export default router