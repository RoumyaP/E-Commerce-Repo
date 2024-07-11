const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errHandler");
const catchAsync = require("../middleware/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");


//Create new order
exports.newOrder = catchAsync(async (req, res, next) => {

    const { orderItems, 
            paymentInfo, 
            itemPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice,
            shippingInfo
        } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    })
});


//Get Single Order
exports.getSingleOrder = catchAsync( async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next( new ErrorHandler("Order not found with this ID",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})


//Get Logged In User Orders
exports.myOrders = catchAsync( async(req,res,next)=>{
    // const order = await Order.find({user:req.user._id});
    const resultPerPage = 5;
    const ordersCount = await Order.countDocuments();

    const apiFeature = new ApiFeatures(Order.find(),req.query)
    .search()
    .filter()

    apiFeature.pagination(resultPerPage);
    let order = await apiFeature.query;

    // let ordersCount = 0;
    // order.forEach(order=>{
    //     ordersCount+=1;
    // })

    res.status(200).json({
        ordersCount,
        order
    })
})



//Get All Orders -- Admin
exports.getAllOrders = catchAsync( async(req,res,next)=>{
    const orders = await Order.find();

    
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})



//Update Order Status -- Admin
exports.updateOrderStatus = catchAsync( async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next( new ErrorHandler("Order not found with this ID",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have alread delivered this order",404));
    }

    if(req.body.status === 'Shipped'){
        order.orderItems.forEach(async (o)=>{
            console.log(o.quantity);
            await updateStock(o.product,o.quantity);
        })
    }
    
    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })
})

async function updateStock (id,quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave:false});
}



//Delete Order -- Admin
exports.deleteOrder = catchAsync( async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next( new ErrorHandler("Order not found with this ID",404));
    }

    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success:true
    })
})
