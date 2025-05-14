import FriendRequest from "../models/FriendRequest.model.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getRecommendedUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentUser = req.user;

  const recommendedUsers = await User.find({
    $and: [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends } },
      { isOnboarded: true },
    ],
  });

  res.status(200).json(new ApiResponse(200, recommendedUsers));
});

const getMyFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

  res.status(200).json(new ApiResponse(200, user.friends));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { id: recipientId } = req.params;

  //prevent sending req to yourself
  if (myId === recipientId) {
    return res.status(400).json( new ApiResponse(400, null, "You cannot send a friend request to yourself"));
  }

  const recipient = await User.findById({ recipientId });
  if (!recipient) {
    return res.status(404).json(new ApiResponse(404, null, "Recipient not found"));
  }

  //check if user is already friends
  if (recipient.friends.includes(myId)) {
    return res.status(400).json(new ApiResponse(400, null, "You are already friends with the user"));
  }

  //check if a req already exists
  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId },
    ],
  });
  if (existingRequest) {
    return res.status(400).json(new ApiResponse(400, null, "Friend request already exists"));
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, friendRequest, "friend request created successfully")
    );
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id: requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
      return res.status(404).json(new ApiResponse(404, null, "request not found"));
  }

  if (friendRequest.recipient.toString() !== req.user._id) {
    return res.status(403).json(new ApiResponse(403, null, "you are not authorized to access this request"));
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  // add each user to the other's friend array
  await User.findByIdAndUpdate(friendRequest.sender, {
    $addToSet: { friends: friendRequest.recipient },
  });

  await User.findByIdAndUpdate(friendRequest.recipient, {
    $addToSet: { friends: friendRequest.sender },
  });

  res
  .status(200)
  .json(new ApiResponse(200, "friend request accepted")); 
});

const getFriendRequests = asyncHandler( async(req, res) => {
    const incomingReqs = await FriendRequest.find({
        recipient: req.user._id, 
        status: "pending",   
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage"); 

    const acceptedReqs = await FriendRequest.find({
        recipient: req.user._id, 
        status: "accepted",
    }).populate("sender", "fullName profilePic"); 

    res
    .status(200)
    .json( new ApiResponse(200, { incomingReqs, acceptedReqs }, "requests fetched")); 
}); 

const getOutgoingFriendRequests = asyncHandler( async(req, res) => {
    const outgoingReqs = await FriendRequest.find({
        sender: req.user._id, 
        status: "pending", 
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage"); 

    res
    .status(200)
    .json( new ApiResponse(200, outgoingReqs, "outgoing requests fetched")); 
})



export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
};
