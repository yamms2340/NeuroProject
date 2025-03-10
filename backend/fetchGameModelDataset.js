import mongoose from "mongoose";
import User from "./models/user.js"; // Ensure this path is correct

export const getProcessedDataset = async (email) => {
  try {
    // Fetch dataset for the user from MongoDB
    const user = await User.findOne({ email });

    if (!user || !user.dataset) {
      return { message: "No dataset found for this email." };
    }

    let processedDataset = Array.isArray(user.dataset) ? [...user.dataset] : [user.dataset]; // Ensure array format

    // If dataset length exceeds 15, remove the oldest entry (first element)
    if (processedDataset.length > 15) {
      processedDataset.shift();
    }

    return processedDataset; // Return modified dataset without saving changes
  } catch (error) {
    console.error("Error fetching dataset from MongoDB:", error);
    throw new Error("Internal Server Error");
  }
};

// ❌ Remove "export default processedDataset" because it is not globally defined
