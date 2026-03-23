import dbconeection from "./DB/db.connection.js"
import authroutes from '../src/moduels/auth/auth.routes.js'
import wishlist from '../src/moduels/wishlist/wishlist.routes.js'
import {globalErrorhandling} from '../src/utils/response/error.response.js'

import cors from 'cors'


const bootstrap =(app,express)=>{
    app.use(express.json())
    app.use(cors())

    app.use('/auth',authroutes)
   app.use('wishlist',wishlist)



 app.use("*",(req,res,next)=>{
    return res.status(404).json({message:"invalid routing"})


 })
 app.use(globalErrorhandling)
 dbconeection()

}


export default bootstrap