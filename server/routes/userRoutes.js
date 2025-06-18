const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const path = require('path');

const router = express.Router();

// Middleware to verify User JWT token
const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ msg: 'No token provided ❌' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Ensure it's not an admin token if needed, or check isAdmin flag
        if (decoded.isAdmin) {
             return res.status(403).json({ msg: 'Admin token used on user route ❌' });
        }
        req.user = decoded; // decoded should contain user id and isAdmin flag
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Invalid token ❌' });
    }
};

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

//loging in user
router.post('/login', async(req,res)=>{
    const {phoneNumber,password} = req.body
    console.log('Login attempt with phone:', phoneNumber);

    try{
        const user = await User.findOne({phoneNumber});
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if(!user) return res.status(400).json({msg:'User not found ❌'})

        const isMatch = await bcrypt.compare(password,user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');
        
        if(!isMatch) return res.status(400).json({msg:'Invalid credentials, please check your password'})

        // Create JWT token for normal user
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'your-secret-key', // Use the same secret key
            { expiresIn: '1d' } // Token expires in 1 day
        );

        console.log('Login successful, sending response with user data and token');
        res.status(200).json({
            msg:'Login successful ✅',
            token, // Include the token in the response
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
        console.error('Login error:', err);
        res.status(500).json({msg:'Server error ❌'})
    }
})

// GET logged-in user's ticket details (Protected User Route)
router.get('/ticket', verifyUserToken, async (req, res) => {
    try {
        // The user ID is available from the verified token in req.user.id
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            // This case should ideally not happen if token is valid, but good to check
            return res.status(404).json({ msg: 'User not found ❌' });
        }

        // Only return ticket details if the user has paid
        if (!user.isPaid) {
             return res.status(403).json({ msg: 'Ticket not available or payment not approved ❌' });
        }

        // Return only the necessary ticket information
        res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            ticket: user.ticket,
            isPaid: user.isPaid
        });
    } catch (err) {
        console.error('Error fetching user ticket:', err);
        res.status(500).json({ msg: 'Server error fetching ticket details ❌' });
    }
});

// GET logged-in user's ticket PDF (Protected User Route)
router.get('/ticketPDF', verifyUserToken, async (req, res) => {
    try {
        // The user ID is available from the verified token in req.user.id
        const userId = req.user.id; 
        const user = await User.findById(userId).select('-password')
        
        if(!user || !user.isPaid){
          return res.status(403).json({msg:'User has not paid or ticket is not available'})
        }
    
        const doc = new PDFDocument();
        const fileName = `TICKET-${user.ticket}.pdf`;
    
        res.setHeader('Content-Disposition',`attachment; filename="${fileName}"`);
        res.setHeader('Content-Type','application/pdf');
    
        doc.pipe(res)
    
        doc.fontSize(25).text('BRBC Conference Ticket', { align: 'center'})
    
        doc.fontSize(16).text(`Full Name: ${user.fullName}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phoneNumber}`);
        doc.text(`Ticket Number: ${user.ticket}`);
        // If you have a checked-in status in User model
        // doc.text(`Checked In: ${user.checkedIn ? 'Yes' : 'No'}`); 
    
        doc.end();

    } catch (err) {
        console.error('Error generating user ticket PDF:', err);
        res.status(500).json({ msg: 'Server error generating ticket PDF ❌' });
    }
});

// KEEPING this endpoint for now, but it might not be needed anymore
router.get('/phone/:phoneNumber', async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  console.log('Looking up user with phone number:', phoneNumber);
  
  try {
    const user = await User.findOne({ phoneNumber });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('No user found with phone number:', phoneNumber);
      return res.status(404).json({ msg: "User not found" });
    }
    
    console.log('Found user:', {
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    });
    res.json(user);
  } catch (err) {
    console.error('Error in /phone/:phoneNumber route:', err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
