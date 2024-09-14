import mongoose from "mongoose";
import { type } from "os";

const productScheema= new mongoose.Schema({
    name:{
        type:String,
        required :[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    catagory:{
        type:String,
        required:[true,"Please Enter Product Catagory"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
            },
            name:{
                type:String,
            },
            rating:{
                type:Number,
            },
            comment:{
                type:String,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Product=mongoose.model("Product",productScheema)

export  {Product}