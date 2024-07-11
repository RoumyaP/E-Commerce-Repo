const app = require("./app");
const cloudinary = require("cloudinary")
const dotenv = require("dotenv");
const connectDB = require("./config/database")



//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down due to Uncaught Exception");
    process.exit(1);
})

//Config

dotenv.config({path:"backend/config/config.env"})

//Connecting to Database
connectDB();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const server = app.listen(4000,'192.168.188.254',()=>{
    console.log(`Server is working`)
})



//Unhandles Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    })
})

