import dbconeection from "./DB/db.connection.js"
import authroutes from './moduels/auth/auth.routes.js'
import wishlist from './moduels/wishlist/wishlist.routes.js'
import { globalErrorhandling } from './utils/response/error.response.js'
import ordersroutes from './moduels/orders/orders.routes.js'
import productroutes from './moduels/products/products.routes.js'
import cartroutes from './moduels/cart/cart.routes.js'
import reviewroutes from './moduels/review/review.router.js'
import cors from 'cors'
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

const bootstrap = (app, express) => {
   app.use(express.json())
   app.use(cors())
   app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

  app.get("/profile", (req, res) => {
    res.send(`Welcome ${req.user.displayName}`);
  });

  app.get("/logout", (req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      res.redirect("/");
    });
  });








   
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