const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


//registering user
router.post('/register', async (req, res) => {
    // console.log('This router is working ✅'); 

  const { fullName, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: 'Hi there, this user already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ msg: 'User has been registered ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


const jwt = require('jsonwebtoken');

//loging in user
router.post('/login', async(req,res)=>{
    const {email,password} = req.body

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({msg:'User entered is not found in the database ❌'})

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:'Credentials entered are invalid, please re-check'})

        res.status(200).json({
            msg:'Login yaita ✅',
            user:{
                id:user._id,
                fullName:user.fullName,
                phoneNumber:user.phoneNumber,
                email:user.email,
                isPaid:user.isPaid,
                ticket:user.ticket
            }
        })
    }catch (err){
        res.status(500).json({msg:'Server error ❌'})
    }
})



module.exports = router;
