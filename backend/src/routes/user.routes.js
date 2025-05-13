import express from "express"; 
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMyFriends, getRecommendedUsers } from "../controllers/user.controller.js";

const router = express.Router(); 


//apply auth middleware to all routes
router.use(protectRoute); 

router.get("/", getRecommendedUsers); 
router.get("/friends", getMyFriends); 

export default router; 