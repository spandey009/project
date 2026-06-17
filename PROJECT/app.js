const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


async function main() {
    await mongoose.connect(MONGO_URL);
}
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
   // res.send('Hello, World!');
    res.redirect('/listings');
});

// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Cozy Cabin in the Woods",
//         description: "A charming cabin surrounded by nature, perfect for a weekend getaway.",
//         image: "",
//         price: 10000,
//         location:"Lakshdweep",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log('Sample listing saved to database');
//     res.send('Sample listing created and saved to database');
// });
//index route
app.get("/listings", async (req, res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    });
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
   // let { title, description, image, price, location, country } = req.body;
   
    //console.log(listing);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





