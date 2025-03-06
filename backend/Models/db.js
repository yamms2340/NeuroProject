
const mongoose = require("mongoose");

const PORT=8080;


mongoose.connect("mongodb+srv://yaminireddy2023:LAKvtqcdAilizfhk@neurocluster0.utmzr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log("mongo db cocnnected")
})
.catch(()=>{
    console.log("mongo db connection failed")
 
})

