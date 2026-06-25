const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn,isOwner,validateListing} = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');

//index route
router.get("/", async (req, res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    });

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

   let listing = await Listing.findById(id)
.populate("owner")
.populate({
    path: "reviews",
    populate: {
        path: "author",
    },
});

    if (!listing) {
       req.flash("error", "Listing not found!");
     return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/",
    isLoggedIn,
    validateListing, wrapAsync(async (req, res) => {
//    let result = listingSchema.validate(req.body);
//    console.log(result);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the current user
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
   } 
));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
       
//update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listingData = req.body.listing;

    listingData.image = {
        filename: "listingimage",
        url: listingData.image
    };

    await Listing.findByIdAndUpdate(id, listingData);

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));
module.exports = router;


