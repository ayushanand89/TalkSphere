import User from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const  getRecommendedUsers = asyncHandler( async(req, res) => {
    const currentUserId = req.user._id;  
    const currentUser = req.user; 

    const recommendedUsers = await User.find({
        $and: [
            { _id: { $ne: currentUserId } },
            { _id: { $nin: currentUser.friends }},
            { isOnboarded: true },
        ],
    })

    res
    .status(200)
    .json(new ApiResponse(200, recommendedUsers)); 
}); 

const getMyFriends = asyncHandler( async(req, res) => {
    const user = await User.findById(req.user._id).select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage"); 

    res.status(200)
    .json(new ApiResponse(200, user.friends)); 
})


export { getRecommendedUsers, getMyFriends }