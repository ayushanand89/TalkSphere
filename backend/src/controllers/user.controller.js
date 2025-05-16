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

  res.status(200).json(recommendedUsers);
});

const getMyFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { id: recipientId } = req.params;

  // Prevent sending request to yourself
  if (myId.toString() === recipientId.toString()) {
    return res
      .status(400)
      .json({ message: "You can't send friend request to yourself" });
  }

  const recipient = await User.findById(recipientId); // ✅ Fixed line
  if (!recipient) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  // Check if already friends
  if (recipient.friends.includes(myId)) {
    return res
      .status(400)
      .json({ message: "You are already friends with this user" });
  }

  // Check if a request already exists
  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId },
    ],
  });
  if (existingRequest) {
    return res
      .status(400)
      .json({
        message: "A friend request already exists between you and this user",
      });
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId,
  });

  res.status(201).json(friendRequest);
});


const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { id: requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    return res.status(404).json({ message: "Friend request not found" });
  }

  if (friendRequest.recipient.toString() !== req.user._id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to accept this request" });
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

  res.status(200).json({ message: "Friend request accepted" });
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

    res.status(200).json({ incomingReqs, acceptedReqs }); 
}); 

const getOutgoingFriendRequests = asyncHandler( async(req, res) => {
    const outgoingReqs = await FriendRequest.find({
        sender: req.user._id, 
        status: "pending", 
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage"); 

    res.status(200).json(outgoingReqs);
})



export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
};
