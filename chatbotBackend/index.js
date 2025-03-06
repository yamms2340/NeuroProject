const express = require("express");
const cors = require("cors");
const router = require("./router");
  // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());  // Fixed missing function call

const port = process.env.PORT || 3000;

// Import chatbot logic (if needed globally)
require("./chatbot");

app.use("/api", router);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
