const ErrorHandler = require("../utils/errHandler");

module.exports = (err,req,res,next)=>{
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message  = err.message || "Internal Server Error";

    //MongoDB ID error
    if(err.name === "CastError"){
        const message = "Resource not found.";
        err = new ErrorHandler(message,400);
    }


    //MongoDB duplicate key error
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }


    //Wrong JWT Token
    if(err.name === "jsonwebtokenError"){
        const message = "JSON Web Token is Invalid, try again";
        err = new ErrorHandler(message,400);
    }


    //JWT Expire Error
    if(err.name === "jsonwebtokenError"){
        const message = "JSON Web Token is Expired, try again";
        err = new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};