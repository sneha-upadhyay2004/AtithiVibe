const { listingSchema,reviewSchema } = require("./Schema");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const Review = require("./models/review")

//validate listing
module.exports.validateListing = (req,res,next) =>{
    const { error } =  listingSchema.validate(req.body);
   if(error){
    const errorMsg = error.details.map((el) => el.message).join(".");
       throw new ExpressError(400,errorMsg);
    }else {
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map((el)=>el.message).join(".")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }  
}

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing!")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
let {id} = req.params;
let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not a Owner of this Listing")
  return  res.redirect(`/listings/${id}`)
}
next();
}

module.exports.isreviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not a Author of this review")
      return  res.redirect(`/listings/${id}`)
    }
    next();
    }