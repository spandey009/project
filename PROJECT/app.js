const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.send('Hello, World!');
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

app.get("/listings", async (req, res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





