import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { upsertStreamUser } from "../lib/stream.js";

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName.trim() || !email.trim() || !password.trim()) {
    throw new ApiError(400, "Please provide all fields");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email Already Exists, please use different email");
  }

  const randomIndex = Math.floor(Math.random() * 100) + 1;
  // tutorial used: https://avatar.iran.liara.run/public/${randomIndex}.png
  const randomAvatar = `https://avatar.iran.liara.run/public/${randomIndex}`;

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
  });

  await upsertStreamUser({
    id:newUser._id.toString(), 
    name: newUser.fullName, 
    image: newUser.profilePic || "", 
  }); 
  console.log(`Stream user created for ${newUser.fullName}`); 

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent client-side JavaScript from accessing the cookie
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // set to true in production
  });

  res.status(201)
    .json(new ApiResponse(201, newUser, "User Created Successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body; 

    if(!email || !password){
        throw new ApiError(400, "both email and password required"); 
    }

    const user = await User.findOne({ email }); 
    if(!user) {
        throw new ApiError(401, "email doesn't exist!"); 
    }

    const isPasswordCorrect = await user.matchPassword(password); 
    if(!isPasswordCorrect) {
        throw new ApiError(401, "wrong password"); 
    }

    
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent client-side JavaScript from accessing the cookie
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // set to true in production
  });

  res
  .status(200)
  .json(new ApiResponse(200, user, "logged in successfully"));

});

const logout = asyncHandler( async (req, res) => {
    res.clearCookie("jwt"); 
    res.status(200)
    .json(new ApiResponse(200, "", "logged out successfully")); 
})

export { signup, login, logout };
