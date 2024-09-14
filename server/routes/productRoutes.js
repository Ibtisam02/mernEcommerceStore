import express from "express"
import { addAReview, createProduct, deleteAProduct, deleteAReview, getAllProducts, getAllReviews, getAProduct, updateAProduct } from "../controllers/productController.js";
import { verifyJWT,authorizeRole } from "../middleware/auth.js";
const router=express.Router();
router.route("/products").get(getAllProducts)
router.route("/admin/product/new").post(verifyJWT,authorizeRole("admin"),createProduct)
router.route("/admin/product/:id").put(verifyJWT,authorizeRole("admin"),updateAProduct).delete(verifyJWT,authorizeRole("admin"),deleteAProduct)
router.route("/product/:id").get(getAProduct)
router.route("/review").put(verifyJWT,addAReview)
router.route("/delete/review").delete(verifyJWT,deleteAReview)
router.route("/delete/review").get(getAllReviews)
export default router