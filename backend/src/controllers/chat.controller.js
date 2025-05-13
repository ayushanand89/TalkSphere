import { generateStreamToken } from "../lib/stream.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const getStreamToken = asyncHandler(async (req, res) => {
  const token = generateStreamToken(req.user._id);

  if (!token) {
    throw new ApiError(500, "Error in getStreamController");
  }

  res
    .status(200)
    .json(new ApiResponse(200, token, "token generated successfully"));
});

export { getStreamToken };
