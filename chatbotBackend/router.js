const { Router } = require("express");
const  {run}  = require("./chatbot");  // Import the run function from chatbot.js

const router = Router(); // Make sure 'router' is defined here

router.post("/prompt-post", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const response = await run(prompt);
        return res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Export the router so it can be used in index.js
module.exports = router;
