import { Product } from "../models/productModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
// new order
const newOdrer = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    payedAt:Date.now(),
    user:req.user._id
  });

  return res.status(201).json({
    success:true,
    order
  })
});

//get single order
const getSingleOrder=asyncHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")

    if (!order) {
        return next(new ErrorHandler("Order not found with this id",404))
    }

    return res.status(200).json({
        success:true,
        order
    })
})
//get logged in user orders
const myOrders=asyncHandler(async (req,res,next)=>{
    const orders=await Order.find({user:req.user._id})

    

    return res.status(200).json({
        success:true,
        orders
    })
})
//get all orders
const getAllOrders=asyncHandler(async (req,res,next)=>{
    const orders=await Order.find()
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    return res.status(200).json({
        success:true,
        orders,
        totalAmount,
    })
})
//update order status
const updateOrderStatus=asyncHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this id",404))
    }
    if (order.orderStatus===req.body.status) {
        return next(new ErrorHandler(`You have already ${req.body.status} this order`,400))
    }
    if (order.orderStatus==="Delivered") {
        return next(new ErrorHandler("You have already delivered this order",400))
    }
    if (req.body.status==="Shipped") {
        
        order.orderItems.forEach(async (item)=>{
            await updateStock(item.product,item.quantity)
        })
    }

    order.orderStatus=req.body.status;
    if (order.orderStatus==="Delivered") {
        order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave:false})
    return res.status(200).json({
        success:true,
    })
})

let updateStock=async (id,quantity)=>{
    const product=await Product.findById(id);
    product.stock-=quantity;

    await product.save({validateBeforeSave:false})
}
//delete order

const deleteOrder=asyncHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Order not found with this id",404))
    }

    await Order.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success:true,
    })
})
export {newOdrer,getSingleOrder,myOrders,getAllOrders,updateOrderStatus,deleteOrder}
