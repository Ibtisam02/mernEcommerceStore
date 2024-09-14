import express from "express"
import errorMiddleware from "./middleware/error.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
const app=express()

app.use(express.json())
app.use(cookieParser())


//routes imports
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

app.use("/api/v1",productRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",orderRoutes)
//error midlerware
app.use(errorMiddleware)
export {app}