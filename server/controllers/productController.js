import { Product } from "../models/productModel.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import asyncHandler from "../middleware/asyncHandler.js"
import ApiFeatures from "../utils/apiFeatures.js"

//create product

const createProduct=asyncHandler(async (req,res)=>{
    
    req.body.user=req.user.id;
    const product= await Product.create(req.body)

    return res.status(201).json({
        success:true,
        product
    })
})

const getAllProducts=asyncHandler(async(req,res)=>{
    const resultPerPage=5;
    const productCount=await Product.countDocuments();
    const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products= await apiFeature.query;
    res.status(200).json({
        success:true,
        productCount,
        products
    })
})

const updateAProduct=asyncHandler(async (req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Fund",404))
    }

    const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    return res.status(200).json({
        success:true,
        updatedProduct
    })
})

//Delete Product

const deleteAProduct=asyncHandler(async (req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if (!product) {
        return  next(new ErrorHandler("Product Not Fund",404))
    }
    await Product.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
})

//Get A Product
const getAProduct=asyncHandler(async (req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Fund",404))
    }
    return res.status(200).json({
        success:true,
        product
    })

})

//Add a review or update

const addAReview=asyncHandler(async (req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    
   const product= await Product.findById(productId)
   const isReviewd= product.reviews.find(item=>item.user==req.user.id) 
   if (isReviewd) {
    product.reviews.forEach((item)=>{
        if (item.user==req.user.id) {
            item.rating=rating;
            item.comment=comment
        }
    })
   }
   else{
    product.reviews.push(review)
    product.numberOfReviews=product.reviews.length
   }

   let avg=0;
   product.reviews.forEach((item)=>{
    avg+=item.rating
   })
   product.rating=avg/product.reviews.length

   await product.save({validateBeforeSave:false});

   return res.status(200).json({
    success:true,
    message:"Review Added successfully"
   })
    })

//get all reviews of a product

const getAllReviews=asyncHandler(async (req,res,next)=>{

    const product=await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not Found!",404))
    }

    return res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

//delete a review

const deleteAReview=asyncHandler(async (req,res,next)=>{
    const product=await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not Found!",404))
    }

    const reviews=product.reviews.filter((item)=>item._id.toString()!==req.query.id.toString())
    let avg=0;
    reviews.forEach((item)=>{
     avg+=item.rating
    })
    const rating=avg/reviews.length
    const numberOfReviews=reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        rating,
        numberOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    return res.status(200).json({
        success:true,
        message:"review delted successfully"
    })
})

export {getAllProducts,createProduct,updateAProduct,deleteAProduct,getAProduct,addAReview,getAllReviews,deleteAReview}