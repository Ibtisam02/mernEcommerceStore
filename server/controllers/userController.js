import User from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/senEmail.js";
import crypto from "crypto"
const registerUser=asyncHandler(async (req,res,next)=>{
    const {name,email,password}=req.body;

    const user= await User.create({
        name,email,password,
        avatar:{
            public_id:"pubid",
            url:"this is url"
        }
    })
    const token=user.generateToken();
    return res.status(201).json({
        success:true,
        message:"User Registered Successfully",
        token:token
    })
})

const loginUser=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email Or Password",400))
    }
    const user= await User.findOne({email}).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid Credentials",401))
    }
    const isPasswordMatched=await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Credentilas",401))
    }
    // creating token and saving in cookie
    sendToken(user,201,res)

})

//Logout User
const logout=asyncHandler(async (req,res,next)=>{
    return res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"Logged Out"
    })
})


//forgot password

const forgetPassword=asyncHandler(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if (!user) {
        return next(new ErrorHandler("User not Found!",404))
    }
    const resetToken= user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})
    
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}` //http://localhost/api/v1/password/reset/{resetToken}

    const message=`Your password reset Link is:- \n\n ${resetPasswordUrl} if you have not requested this email then please ignore`

    try {
        await sendEmail({
            email:user.email,
            subject:"Ecommerce password recovery",
            message:message
        })

        return res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500))
    }
})

//reset password

const resetPassword=asyncHandler(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user=await User.findOne({resetPasswordToken:resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});

    if (!user) {
        return next(new ErrorHandler("invalid or expired password reset token",400))
    }
    if (req.body.password!==req.body.confirmPassword) {
        return next(new ErrorHandler("Password dose not match comfirm password",400))
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save()
    sendToken(user,200,res)
})

//get user details

const getUserDetails=asyncHandler(async (req,res,next)=>{
    const user= await User.findById(req.user.id);
    return res.status(200).json({
        success:true,
        message:"User Details Fetched",
        user
    })
})

//update user password
const changeUserPassword=asyncHandler(async (req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect",400))
    }

    if (req.body.newPassword!==req.body.confirmPassword) {
        return next(new ErrorHandler("New password and confirm password should mathch",400))
    }

    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res)
})
const updateUserProfile=asyncHandler(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    //we will add clodinary later

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})

//get all user

const getAllUsers=asyncHandler(async(req,res,next)=>{
    const users=await User.find()

    res.status(200).json({
        success:true,
        users
    })
})

//get single user details
const getSingleUserDetails=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`user dosenot exist with id ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//update user role --Admin
const updateUserRole=asyncHandler(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    if (!user) {
        return next(new ErrorHandler(`User dose'nt exist with id ${req.params.id}`,404))
    }

    res.status(200).json({
        success:true
    })
})

//delete user
const deleteUser=asyncHandler(async (req,res,next)=>{
    console.log(req.params.id)

    //we will remove cloudinary

    const user=await User.findById(req.params.id) 
    if (!user) {



        return next(new ErrorHandler(`User dose'nt exist with id ${req.params.id}`,404))
    }

    await User.findByIdAndDelete(req.params.id) 


   return res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})





export {registerUser,loginUser,logout,forgetPassword,resetPassword,getUserDetails,changeUserPassword,updateUserProfile,getAllUsers,getSingleUserDetails,updateUserRole,deleteUser,}