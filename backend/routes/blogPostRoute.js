import express from "express";
import Blogpost from "../models/blogPostSchema.js";
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

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


router.get('/', async (req, res, next)=> {

    const { page = 1, limit = 10 }= req.query
    try {
        const blogPosts = await Blogpost.find()
        .limit(parseInt(limit))
        .skip((parseInt(page) -1)*parseInt(limit))

        const total= await Blogpost.countDocuments()


        res.json({
            total,
            page: parseInt(page),
            totalePages: Math.ceil(total/limit),
            blogPosts
        })

    } catch (err) {
        next(err)
    }
})



router.get('/:id', async (req, res, next)=> {
    try {
        const blogPost = await Blogpost.findById(req.params.id)
        if(!blogPost) return res.status(404).json({error: "Blogpost not found"})
            res.send(blogPost)
    } catch (err) {
        next(err)
    }
    
})


router.post ('/', async (req, res, next)=> {
    const {category, title, cover, content, readtime, author}= req.body
    try {
        const newBlogPost = new Blogpost ({
            category, 
            title, 
            cover, 
            content, 
            readtime, 
            author
        })
        await newBlogPost.save()

        res.status(201).json(newBlogPost)
    } catch (err) {
        next(err)
    }

})

router.put('/:id', async (req, res, next)=> {
    try {
        const author = await Blogpost.findByIdAndUpdate(req.params.id, req.body, {
            new:true, 
            runValidators: true
        })
        if (!author) {
            return res.status(404).json({error: 'Blogpost not found'})
        }
        res.status(200).json(blogPost)
            
    } catch (err) {
        next(err)
    }
})

router.patch('/:id/cover', upload.single('cover'), async (req, res, next) => {
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

router.delete('/:id', async (req, res, next)=> {
    try {
        const blogPost = await Blogpost.findByIdAndDelete(req.params.id)
    if(!blogPost) return res.status(404).json({error: 'Bogpost not found'})
       res.status(200).json({ message: 'Blogpost deleted'})  
     } catch (err) {
        next(err)
     }
})



export default router