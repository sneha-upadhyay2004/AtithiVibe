const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {validateListing,isLoggedIn,isOwner} = require("../middleware.js");
const Listing = require("../models/listing.js");
const multer=require('multer');
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});


// /listings 
router.get("/", wrapAsync (async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/main",{allListings})
}));

router.post("/",isLoggedIn,upload.single("listing[image]"),
 validateListing, wrapAsync(async(req,res)=>{
  
    let url = req.file.path;
    let filename = req.file.filename;
  console.log(url, "..", filename)
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url,
      filename,
    };
   
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}));
router.get("/new",isLoggedIn,(req,res)=>{
   res.render("listings/new.ejs") 
})


//show
router.get("/:id",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews",
        populate:{
            path:"author",
        }})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")  
        res.redirect("/listings")
    }
   
    res.render("listings/show.ejs",{listing})
}));
router.get("/:id", (async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")  
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}));

router.put("/:id",validateListing,isLoggedIn,isOwner
    ,wrapAsync(async(req,res)=>{
   
    let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing})
     req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
}));

// delete route
router.delete("/:id",isLoggedIn,isOwner,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);

    console.log(deletedlistings)
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")
}));

module.exports = router;