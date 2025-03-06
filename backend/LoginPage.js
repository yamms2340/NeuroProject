const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser=require('body-parser')
const cors=require('cors')
const PORT=8080;
const authLoc=require('./Routes/AuthRouter')

require("dotenv").config();

require('./Models/db')
app.get('/ping',(req,res)=>{
res.send("hey.....i lovee youuu")
})

app.use(bodyParser.json())
app.use(cors())
app.use('/authenticate',authLoc)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
