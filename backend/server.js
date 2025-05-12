import express from "express";
import "dotenv/config";
import db from "./db.js";
import authorRoute from './routes/authorRoute.js'
import blogPostRoute from './routes/blogPostRoute.js'
import cors from 'cors'
import authEndpoint from './routes/auth.js'
import passport from 'passport'
import GoogleStrategy from "./middlewares/OAuthMiddleware.js";





const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
passport.use('google', GoogleStrategy)


app.use(authEndpoint)

db()


// app.get ('/', (req, res)=> {
//     res.send("Ciao Mondo!")
// })

app.use ('/authors', authorRoute)
app.use('/blogPosts', blogPostRoute)

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
})