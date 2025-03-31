if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const path = require("path")
const ExpressError = require("./utils/ExpressError.js")
const flash = require("connect-flash")
const session = require("express-session");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
const uri = process.env.MONGO_URL;



// routesssssssss
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")



main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err.message)
});
async function main(){
    await mongoose.connect(uri)
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate)
app.use(methodOverride("_method"));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expire:Date.now() + 7 * 24 * 60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,   
    }
};

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page Not Found"))
});


app.use((err,req,res,next)=>{
 let{statusCode=500, message="something went wrong"} = err;
 res.status(statusCode).render("error.ejs",{err})
})

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
})