import mongoose from "mongoose";


export const fetchIQScore = async (userId) => {
  try {
    const userIQ = await IQScore.findOne({ userId });
    if (!userIQ) {
      return { message: "User IQ score not found", iqScore: null };
    }
    return { iqScore: userIQ.iqScore };
  } catch (error) {
    console.error("Error fetching IQ Score:", error);
    throw new Error("Failed to fetch IQ score");
  }
};
