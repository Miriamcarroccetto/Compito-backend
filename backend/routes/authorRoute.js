import express from "express";
import Author from "../models/authorSchema.js";
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
      folder: 'uploads',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: (req, file) => `avatar-${Date.now()}`
    }
  })
  
  const upload = multer({ storage })

router.get('/', async (req, res, next)=> {

    const {page=1, limit=10}= req.query
    try {
        const authors = await Author.find()
        .limit(parseInt(limit))
        .skip((parseInt(page)-1)*parseInt(limit))

        const total= await Author.countDocuments()
        res.json({
            total,
            page: parseInt(page),
            totalePages: Math.ceil(total/limit),
            authors
        })



    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next)=> {
    try {
        const author = await Author.findById(req.params.id)
        if(!author) return res.status(404).json({error: "Author not found"})
            res.send(author)
    } catch (err) {
        next(err)
    }
    
})


router.post ('/', async (req, res, next)=> {
    const {name, lastname, email, birthday, avatar}= req.body
    try {
        const newAuthor = new Author ({
            name, 
            lastname, 
            email, 
            birthday, 
            avatar
        })
        await newAuthor.save()

        res.status(201).json(newAuthor)
    } catch (err) {
        next(err)
    }

})

router.put('/:id', async (req, res, next)=> {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new:true, 
            runValidators: true
        })
        if (!author) {
            return res.status(404).json({error: 'Author not found'})
        }
        res.status(200).json(author)
            
    } catch (err) {
        next(err)
    }
})

router.patch('/:id/avatar', upload.single('avatar'), async (req, res, next) => {
    try {
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.path },
        { new: true }
      )
      if (!author) return res.status(404).json({ error: 'Author not found' })
      res.status(200).json(author)
    } catch (err) {
      next(err)
    }
  })

router.delete('/:id', async (req, res, next)=> {
    try {
        const author = await Author.findByIdAndDelete(req.params.id)
    if(!author) return res.status(404).json({error: 'Author not found'})
       res.status(200).json({ message: 'Author deleted'})  
     } catch (err) {
        next(err)
     }
})

export default router