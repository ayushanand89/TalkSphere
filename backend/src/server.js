import express from "express"; 
import "dotenv/config";
import authRoutes from "./routes/auth.route.js"; 
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; 
import userRoutes from "./routes/user.routes.js"

const app = express(); 
const PORT = process.env.PORT

app.use(express.json()); 
app.use(cookieParser()); 


app.use("/api/auth", authRoutes); 
app.use("api/users", userRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    connectDB(); 
}); 