import mongoose from "mongoose";

export const getProcessedDataset = async (email) => {
  try {
    // Fetch dataset for the user from MongoDB
    const userDataset = await Dataset.findOne({ email });

    if (!userDataset) {
      return { message: "No dataset found for this email." };
    }

    let processedDataset = [...userDataset.dataset]; // Clone dataset array

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

export default processedDataset;