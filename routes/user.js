const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",WrapAsync(async(req,res)=>{

    try{
        let {username,email,password} = req.body;
        const newUser =   new User({email,username})
        const registeredUser =  await User.register(newUser, password);
        console.log(registeredUser)

         req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            
      req.flash("success","Welcome to Wanderlust!")
      res.redirect("/listings");
         })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
 
    }));
    router.get("/login",(req,res)=>{
        res.render("users/login.ejs")})

    router.post("/login",saveRedirectUrl,
        passport.authenticate('local',
            {failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
    req.flash("successs","welcome to wanderlust!you are logged in!")
    res.redirect("/listings")
    })

    router.get("/logout",(req,res,next)=>{
     req.logout((err)=>{
        if(err){
        return   next(err);
        }
        req.flash("success","you are logged out now");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);

     })   
    })



module.exports = router;