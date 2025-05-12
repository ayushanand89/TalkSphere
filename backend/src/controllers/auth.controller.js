import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.j";
import { ApiResponse } from "../utils/ApiResponse.js";

const signup = asyncHandler( async(req, res) => {
    const { name, email, password } = req.body; 
    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide all fields");
    }
})

export const login = async (req, res) => {
    res.send("Login Route");
}; 

export const logout = async (req, res) => {
    res.send("Logout Route");
}; 