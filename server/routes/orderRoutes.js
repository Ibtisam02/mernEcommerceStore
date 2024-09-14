import express from "express"
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOdrer, updateOrderStatus } from "../controllers/orderController.js";
import { authorizeRole, verifyJWT } from "../middleware/auth.js"

const router=express.Router();

router.route("/order/new").post(verifyJWT,newOdrer)
router.route("/order/:id").get(verifyJWT,getSingleOrder).delete(verifyJWT,authorizeRole("admin"),deleteOrder)
router.route("/orders/me").get(verifyJWT,myOrders)
router.route("/admin/orders").get(verifyJWT,authorizeRole("admin"),getAllOrders)
router.route("/admin/order/:id").put(verifyJWT,authorizeRole("admin"),updateOrderStatus)


export default router