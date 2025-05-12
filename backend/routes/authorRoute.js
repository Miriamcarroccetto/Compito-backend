import express from "express";
import Author from "../models/authorSchema.js";
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import authMiddleware from '../middlewares/authMiddleware.js'
import passport from "passport";
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const jwtSecretKey = process.env.JWT_SECRET_KEY


const router = express.Router()

//CLOUDINARY
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

//GET TUTTI AUTORI
router.get('/', authMiddleware,  async (req, res, next)=> {

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

//GET PROFILO UTENTE

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Non autorizzato" });
    }
    const author = await Author.findById(userId);
    if (!author) {
      return res.status(404).json({ error: "Utente non trovato" });
    }
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
});

//GET PROFILO CON ID

router.get('/:id',authMiddleware,  async (req, res, next)=> {
    try {
        const author = await Author.findById(req.params.id)
        if(!author) return res.status(404).json({error: "Author not found"})
            res.send(author)
    } catch (err) {
        next(err)
    }
    
})


//POST AUTORE
 
router.post('/', async (req, res, next) => {
    const { name, lastname, email, birthday, avatar, password } = req.body;

    try {
       
        const existingUser = await Author.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email già registrata" })
        }

       
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        const newAuthor = new Author({
            name,
            lastname,
            email,
            birthday,
            avatar,
            password: hashedPassword
        });

        
        await newAuthor.save();

        
        const token = jwt.sign({
            id: newAuthor._id,
            email: newAuthor.email,
            name: newAuthor.name,
            lastname: newAuthor.lastname
        }, jwtSecretKey, { expiresIn: '60d' })
       
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
});


//LOGIN 
router.post ('/login', async (req, res, next) => {
    const {email, password } = req.body

    const user = await Author.findOne({email: email})
    console.log(user)
    if(user) {
        const log = await bcrypt.compare(password, user.password)
        if(log){

            const token = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname

            }, jwtSecretKey, {expiresIn: '60d'
            })

            return res.status(200).json({token})
        } else {
            return res.status(400).json({message: "Invalid password"})}
        } else {
            return res.status(400).json({message: "Invalid email"})
        }
    }
)

//GOOGLE LOGIN

router.get('/auth/googlelogin', passport.authenticate("google", {scope:["profile", "email"]}) )

router.get('/auth/callback', passport.authenticate("google", {session: false, failureRedirect: '/login'}),
 (req, res, next)=> {
   try {
       res.redirect(`http://localhost:3000/home?token=${req.user.accessToken}`)

      if (!token) {
        return res.status(400).json({ message: "Token non trovato" });
      }
    
    } catch (err) {
      next(err)
    }
})

//MODIFICA UTENTE 

router.put('/:id',authMiddleware,  async (req, res, next)=> {
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

//MODIFICA IMMAGINE

router.patch('/:id/avatar', authMiddleware,  upload.single('avatar'), async (req, res, next) => {
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


//ELIMINA UTENTE
router.delete('/:id',authMiddleware,  async (req, res, next)=> {
    try {
        const author = await Author.findByIdAndDelete(req.params.id)
    if(!author) return res.status(404).json({error: 'Author not found'})
       res.status(200).json({ message: 'Author deleted'})  
     } catch (err) {
        next(err)
     }
})



export default router