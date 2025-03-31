// const mongoose = require("mongoose")
// const initData = require("./data.js")
// const Listing = require("../models/listing.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/AtithiList"
// main()
// .then(()=>{
//     console.log("connected to db")
// })
// .catch((err)=>{
//     console.log(err.message)
// });
// async function main(){
//     await mongoose.connect(MONGO_URL);
// }



// const initDB = async()=>{
//     initData.data = initData.data.map((obj)=>({
//         ...obj, owner:user._id,
//     }))
//     await Listing.insertMany(initData.data)
// }
// initDB();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Import the User model

const MONGO_URL = "mongodb://127.0.0.1:27017/AtithiList";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err.message);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // Create a sample user to act as the owner
    const user = await User.create({
        username: "testuser",
        email: "testuser@example.com",
    });

    // Ensure user._id is available for each listing
    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: user._id, // Assign the user ID to the owner field
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("Database initialized with listings and owner!");
};

// Call the function
initDB();



