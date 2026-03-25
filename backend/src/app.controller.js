import dbconeection from "./DB/db.connection.js"
import authroutes from './moduels/auth/auth.routes.js'
import wishlist from './moduels/wishlist/wishlist.routes.js'
import { globalErrorhandling } from './utils/response/error.response.js'
import ordersroutes from './moduels/orders/orders.routes.js'
import productroutes from './moduels/products/products.routes.js'
import cartroutes from './moduels/cart/cart.routes.js'
import reviewroutes from './moduels/review/review.router.js'
import cors from 'cors'



const bootstrap = (app, express) => {
   app.use(express.json())
   app.use(cors())

   app.use('/auth', authroutes)
    app.use('/review', reviewroutes)
   app.use("/uploads", express.static("uploads"));
   app.use('/order', ordersroutes);
   app.use('/product', productroutes);
   app.use('/wishlist', wishlist)
   app.use('/cart', cartroutes)



   app.use("*", (req, res, next) => {
      return res.status(404).json({ message: "invalid routing" })


   })
   app.use(globalErrorhandling)
   dbconeection()

}


export default bootstrap