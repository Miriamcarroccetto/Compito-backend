import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import "dotenv/config";
import Author from "../models/authorSchema.js";
import jwt from 'jsonwebtoken'
const jwtSecretKey = process.env.JWT_SECRET_KEY


const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/authors/auth/callback",

}, async function (accessToken, refreshToken, profile, passportNext) {
    try {
        console.log(("PROFILE: ", profile))
        const { email, name, given_name, family_name,picture, email_verified } = profile._json
        const user = await Author.findOne({ email })
        if (user) {
            console.log("Utente già registrato")
            const accessToken = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname
            }, jwtSecretKey, { expiresIn: '60d'})
             return passportNext(null, {accessToken})
        } else {
            const newUser = new Author ({
                 name: given_name,
                 lastname: family_name,
                 email: email,
                 avatar: picture,
                 password: '-',
                 verified: email_verified,
                 birthday: new Date('1970-01-01') 
                 
            })
            const createUser = await newUser.save()

            const accessToken = jwt.sign({
                id: createUser.id,
                email: createUser.email,
                name: createUser.name,
                lastname: createUser.lastname
            }, jwtSecretKey, { expiresIn: '60d'})
             return passportNext(null, { accessToken })
        }
       
    } catch (err) {
       return passportNext(err)
    }
}

);

export default googleStrategy