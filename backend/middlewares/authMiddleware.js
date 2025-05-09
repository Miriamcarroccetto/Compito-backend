import jwt from 'jsonwebtoken'
import 'dotenv/config'
import Author from "../models/authorSchema.js";
const jwtSecretKey = process.env.JWT_SECRET_KEY

const authMiddleware = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send('Token required')
      }
  
      const token = authHeader.replace('Bearer ', '').trim()
      const data = await verifyJWT(token)
  
      if (!data.exp) {
        return res.status(401).send('Please login again')
      }
  
      const me = await Author.findById(data.id)
      if (!me) {
        return res.status(401).send('Author not found')
      }
  
      req.author = me
      next()
    } catch (err) {
      return res.status(401).send('Invalid or expired token')
    }
  };

const verifyJWT = (token)=> {
    return new Promise((res, rej)=>{
        jwt.verify(token, jwtSecretKey, (err, data) => {
            if(err) rej(err)
                else res(data)
        })
    })
}
export default authMiddleware