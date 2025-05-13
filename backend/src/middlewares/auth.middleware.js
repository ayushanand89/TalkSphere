import jwt from "jsonwebtoken"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import "dotenv/config"; 


const protectRoute = asyncHandler( async( req, res, next ) => {
    const token = req.cookies.jwt; 
    if(!token) {
        return new ApiError(401, "Unauthorized - no token found"); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 

    if(!decoded) {
        return new ApiError(401, "Unauthorized - Invalid Token"); 
    }

    const user = await User.findById(decoded.userId).select("-password"); 
    if(!user) {
        return new ApiError(401, "Unauthorized - user not found"); 
    }

    req.user = user; 
    next(); 
})

export { protectRoute }; 