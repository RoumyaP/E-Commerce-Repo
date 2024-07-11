const mongoose = require("mongoose");



const connectDB = async()=>{
    mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true,serverSelectionTimeoutMS: 30000}).then((data)=>{
        console.log('MongoDB connected with server');
    })
}

module.exports = connectDB