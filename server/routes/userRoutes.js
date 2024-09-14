import express from "express"
import { changeUserPassword, deleteUser, forgetPassword, getAllUsers, getSingleUserDetails, getUserDetails, loginUser, logout, registerUser, resetPassword, updateUserProfile, updateUserRole } from "../controllers/userController.js"
import { authorizeRole, verifyJWT } from "../middleware/auth.js"
const router=express.Router()

router.route("/register").post(registerUser)
router.route("/login").post( loginUser)
router.route("/logout").get( logout)
router.route("/password/forgot").post( forgetPassword)
router.route("/password/reset/:token").put( resetPassword)
router.route("/me").get(verifyJWT, getUserDetails)
router.route("/password/update").put(verifyJWT, changeUserPassword)
router.route("/me/update").put(verifyJWT, updateUserProfile)
router.route("/admin/users").get(verifyJWT,authorizeRole("admin"), getAllUsers)
router.route("/admin/user/:id").get(verifyJWT,authorizeRole("admin"), getSingleUserDetails).put(verifyJWT,authorizeRole("admin"),updateUserRole).delete(verifyJWT,authorizeRole("admin"),deleteUser)

export default router