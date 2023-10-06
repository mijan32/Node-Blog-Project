const express = require('express');
const Post=require('../model/Post')
const router = express.Router();
const User=require('../model/User')
const adminLayout='../views/layout/admin'
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const JwtSecret=process.env.JWt_SECRET
router.get('/admin',(req,res)=>{
    try{
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
    res.render('admin/index',{locals,layout:adminLayout})
    }
    catch(e){
    console.log(e);
    }
})



router.post('/admin', async (req, res) => {
    try {
        console.log("Hello");
        const { username, password } = req.body; // Extracting username and password from the request body
   const user=await User.findOne({username})
   if(!user){
    console.log("hellojj");
    return res.status(401).json({message:"Invlid User"})
   }  
     const isPasswordValide= await bcrypt.compare(password, user.password)
     console.log(isPasswordValide);
     if(!isPasswordValide){
        console.log("hello");
        return res.status(401).json({message:"Invlid Password"})
     }

     const token=Jwt.sign({userId:user._id}, JwtSecret)
     res.cookie('token', token, {httpOnly:true})
     res.redirect('/dashboard')
    } catch (e) {
        console.log(e); // Logging any unexpected errors
    }
});

router.get("/dashboard",(req,res)=>{
    res.render('admin/dashboard')
})





// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body; // Extracting username and password from the request body

//         const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with 10 rounds of encryption

//         try {
//             const user = await User.create({
//                 username,
//                 password: hashedPassword // Saving the hashed password to the database
//             });

//             res.status(201).json({ message: 'user created', user }); // Responding with a JSON object indicating successful user creation
//         } catch (e) {
//             if (e.code == 11000) {
//                 res.status(409).json({ message: 'User already exists' }); // Handling the case where the username is already in use
//             }
//             res.status(500).json({ message: 'Internal Server Error' }); // Handling other potential errors
//         }
//     } catch (e) {
//         console.log(e); // Logging any unexpected errors
//     }
// });





module.exports =router