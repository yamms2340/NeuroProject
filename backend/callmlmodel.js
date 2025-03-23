import axios from "axios";

const callModel = async (userId) => {
    try {
        const ngrokUrl = "https://6c9c-34-106-171-138.ngrok-free.app";  // Update this with your latest ngrok URL

        const response = await axios.post(
            `${ngrokUrl}/MLGamepredict`,  // ✅ Ensure the endpoint is correct
            { userId: userId }, // ✅ Pass only userId, not user._id
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true  // Ensure Flask allows credentials
            }
        );
        return response.data; // ✅ Return the ML model's response
    } catch (error) {
        console.error("❌ Error calling ML model", error.message);
        return { error: "ML model failed" };
    }
};

export default callModel;
