import { axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
  try {
    console.log("Signup Payload:", signupData);
    const response = await axiosInstance.post("/auth/signup", signupData);
    console.log("Signup Response:", response.status, response.data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.status, error.response?.data);
    throw error;
  }
};