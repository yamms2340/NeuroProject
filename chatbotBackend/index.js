const express = require("express");
const cors = require("cors");
require("dotenv").config();  // Corrected dotenv import

const app = express();

app.use(cors());
app.use(express.json());  // Fixed function call

const port = process.env.PORT || 3000;

// Import chatbot logic
require("./chatbot");

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
