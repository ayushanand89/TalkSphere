import jwt from "jsonwebtoken"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import "dotenv/config"; 


const protectRoute = asyncHandler( async( req, res, next ) => {
    const token = req.cookies.jwt; 
    if(!token) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized - no token found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 

    if(!decoded) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized - Invalid Token"));
    }

    const user = await User.findById(decoded.userId).select("-password"); 
    if(!user) {
        return res.status(404).json(new ApiResponse(404, null, "Unauthorized - user not found"));
    }

    req.user = user;
    next();
})

export { protectRoute }; 