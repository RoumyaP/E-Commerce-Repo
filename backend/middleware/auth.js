const catchAsync = require("./catchAsync");
const ErrorHandler = require("../utils/errHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels")

exports.isAuthenticatedUser = catchAsync(async(req,res,next)=>{
    const { token } = req.cookies;

    console.log('Token:', token);

    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);


    req.user = await User.findById(decodedData.id);


    next();
});


exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403));
        }
        
        next();
    };
};
