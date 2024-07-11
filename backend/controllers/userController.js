const ErrorHandler = require("../utils/errHandler");
const catchAsync = require("../middleware/catchAsync");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


//Register a user
exports.registerUser = catchAsync( async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    })
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    const token = user.getJWTToken();

    sendToken(user,201,res); 
});


//Login User
exports.loginUser = catchAsync( async(req,res,next)=>{
    console.log(req.body);
    const {email,password} = req.body;

    //chech if user gave bith
    if(!email || !password){ 
        return next(new ErrorHandler("Please enter email and password",400)); 
    }
    
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    console.log(isPasswordMatched);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
});


//Logout
exports.logout = catchAsync( async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true

    });

    res.status(200).json({
        success:true,
        message:"Logged out seccessfully"
    })
});


//Forgot Password
exports.forgotPassword = catchAsync( async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("user not found",404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});


    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next( new ErrorHandler(error.message,500));
    }

});


//Reset Password
exports.resetPassword = catchAsync( async(req,res,next)=>{

    //Creating token hash
    const resetPasswordToken = crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or has been Expired",400));
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    sendToken(user,200,res);
});


//Get User Details
exports.getUserDetails = catchAsync( async(req,res,next)=>{
    
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});


//Update User Password
exports.updatePassword = catchAsync( async(req,res,next)=>{
    
    const user = await User.findById(req.user.id).select("+password");
    

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();


    sendToken(user,200,res);
});


//Update User Profile
exports.updateProfile = catchAsync( async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }
    if(req.body.avatar !== ''){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url:myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
});




//Get all users -- admin
exports.getAllUsers = catchAsync( async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});



//Get user details -- admin
exports.getUser = catchAsync( async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    });
});




//Update User Role -- Admin
exports.updateRole = catchAsync( async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
});



//Delete User Profile -- Admin
exports.deleteUser = catchAsync( async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
});