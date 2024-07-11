const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errHandler");
const catchAsync = require("../middleware/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Create Product -- Admin
exports.createProduct = catchAsync(async (req,res,next)=>{

    let images = [];

    if (typeof req.body.image === "string") {
        images.push(req.body.image);
    } else {
        images = req.body.image;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        });

        imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
        });
    }

    req.body.image = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})


//Get All Products
exports.getAllProducts = catchAsync(async(req,res,next)=>{
    
    // return next( new ErrorHandler("This is my temp error",500));

    const resultPerPage = 8;
    const totalProducts = await Product.find();
    const productsCount = await Product.countDocuments();
    
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()

    
    let products = await apiFeature.query;
    console.log(products);
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();
    res.status(200).json({
        success:true,
        products,
        productsCount,
        totalProducts,
        resultPerPage,
        filteredProductsCount
    })
})

// Get All Product -- Admin
exports.getAdminProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

//Update Product -- Admin
exports.updateProduct = catchAsync(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));            
    }



    let images = [];

    if (typeof req.body.image === "string") {
        images.push(req.body.image);
    } else {
        images = req.body.image;
    }

    if (images !== undefined) {
        for (let i = 0; i < product.image.length;  i++) {
            console.log(product.image[i].public_id);
            await cloudinary.v2.uploader.destroy(product.image[i].public_id);
        }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imagesLinks;
  }



    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true, 
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
})

//Delete Product -- Admin
exports.deleteProduct = catchAsync(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));            
    }


   for (let i = 0; i < product.image.length; i++) {
        await cloudinary.v2.uploader.destroy(product.image[i].public_id);
   }


    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
})

//Get One Product
exports.getSingleProduct = catchAsync(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404));            
    }

    res.status(200).json({
        success:true,
        product
    })

})


//Review or Update Review
exports.reviewProduct = catchAsync(async(req,res,next)=>{

    const {rating,comment,productId} = req.body;


    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment:comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=>rev.user.toString() === req.user._id);

    if(isReviewed){
        product.review.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    });
    product.ratings = avg/product.reviews.length;
    

    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success:true
    })

});



//Get all review of product
exports.getAllReviews = catchAsync(async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })    
});
    


//Delete Reviews
exports.deleteReview = catchAsync(async(req,res,next)=>{

    const product = await Product.findById(req.query.productid);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString());



    let avg = 0;
    reviews.forEach(rev=>{
        avg+=rev.rating
    });
    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;



    await Product.findByIdAndUpdate(req.query.productid,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });


    res.status(200).json({
        success:true
    })    
});
    