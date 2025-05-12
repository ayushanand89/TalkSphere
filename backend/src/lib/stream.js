import { StreamChat } from "stream-chat"; 
import "dotenv/config"
import { asyncHandler } from "../utils/asyncHandler.js";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET; 

if(!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing"); 
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); 

const upsertStreamUser = asyncHandler( async(userData) => {
    await streamClient.upsertUsers([userData]); 
    return userData; 
})

//TODO
const generateStreamToken = asyncHandler( async() => {})


export { upsertStreamUser, generateStreamToken }