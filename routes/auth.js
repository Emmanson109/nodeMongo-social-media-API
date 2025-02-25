const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register',  async (req,res) => {
   
   try {
 

      // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
    // creating new user
    const newUser = await User({
      username:req.body.username,
      email:req.body.email,
      password:hashedPassword,
     });

     // save user and response
    const user = await newUser.save();
    res.status(200).json(user)
   } catch (error) {
    res.status(500).json({message: error.message})
   }
});

//LOGIN

router.post('/login', async (req,res) =>{
   try {
       const user = await User.findOne({email:req.body.email});
       !user && res.status(404).json('user not found, please register');

       const validPassword = await bcrypt.compare(req.body.password, user.password);
       !validPassword && res.status(400).json('wrong password');

       res.status(200).json(user);  
       
   } catch (error) { 
      res.status(500).json({message: error.message});
   }
})


module.exports = router;