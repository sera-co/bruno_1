const express = require('express');
const mongoose=require('mongoose')
const dotenv=require('dotenv').config()
const bcrypt=require('bcryptjs')
const { resolve } = require('path');

const app = express();
app.use(express.json())

const port = 5000;

mongoose.connect(process.env.DB_URI)
  .then(()=>console.log("Connected to MongoDB"))
  .catch((err)=>console.error("Error connecting to MongoDB"))


const userSchema=new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true}
})
const User =mongoose.model("User",userSchema)


app.use(express.static('static'));


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);


    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
