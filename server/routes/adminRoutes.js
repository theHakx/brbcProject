const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer')
const PDFDocument = require('pdfkit')
const path = require('path')
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ msg: 'No token provided ❌' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Invalid token ❌' });
    }
};

// Admin login (this should NOT be protected by verifyToken)
router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;
    
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ msg: 'User not found ❌' });
        
        if (!user.isAdmin) return res.status(403).json({ msg: 'Not authorized as admin ❌' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials ❌' });
        
        // Create JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: true },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );
        
        res.status(200).json({
            msg: 'Admin login successful ✅',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ msg: 'Server error ❌' });
    }
});

// Validate token endpoint (should be protected)
router.get('/validate-token', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Not authorized ❌' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ msg: 'Server error ❌' });
    }
});

// Protect all other admin routes with verifyToken middleware
router.use(verifyToken);

// GET all users (for admin dashboard)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error while trying to fetch users' });
    }
});

// Approving user and assigning ticket
router.put('/approve/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Simple ticketing part
    const ticketId = `TICKET-${Date.now()}-${userId.slice(-4)}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { isPaid: true, ticket: ticketId },
      { new: true }//false
    );

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ msg: 'User approved and ticket assigned ✅', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error approving user' });
  }
});

// ticket generation
router.put('/approve/:userId',async (req,res) =>{
  try {
    const ticketNumber = 'TICKET-'+ Math.floor(100000 + Math.random() * 900000)

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {isPaid:true, ticket:ticketNumber},
      {new:true}
    )

    if(!user) return res.status(404).json({msg:'User not found'})

 

      res.status(200).json({msg:'User has been approved and assigned ✅',user})
  } catch (err){
    res.status(500).json({msg:'Server error during approving user and ticket ❌'})
  }
})

router.get('/ticket/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user || !user.isPaid)
      return res.status(403).json({ msg: 'Ticket not available or the user has not paid' });

    res.status(200).json({
      fullName: user.fullName,
      ticket: user.ticket,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error while fetching ticket❌' });
  }

});


router.get('/testEmail',async (req,res)=>{
  try{
    await sendEmail(
      'brbc.clive@gmail.com',
      'hakapericlive@gmail.com',
      '<p>This is for testing<p/>'

    );
    res.status(200).json({msg:'Test email has been sent!✅'})
  }catch(err){
    console.log('email testing failed❌')
    res.status(500).json({msg:'Email testing failed❌'})
  }
})

//PDF generation

router.get('/ticketPDF/:userId',async (req,res)=>{
  try {
    const userId = req.params.userId.trim();
    const user = await User.findById(userId).select('-password')
    if(!user || !user.isPaid){
      return res.status(403).json({msg:'User has not paid or ticket is not available'})
    }

    const doc = new PDFDocument();
    const fileName = `TICKET-${user.ticket}.pdf`;

    res.setHeader('Content-Disposition',`attachment fileName="${fileName}"`);
    res.setHeader('Content-Type','application/pdf');

    doc.pipe(res)

    doc.fontSize(25).text('BRBC Conference Ticket', { align: 'center'})

    doc.fontSize(16).text(`Full Name: ${user.fullName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phoneNumber}`);
    doc.text(`Ticket Number: ${user.ticket}`);
    doc.text(`Checked In: ${user.checkedIn ? 'Yes' : 'No'}`);

    doc.end();
  }catch(err){
    console.error('PDF generation error ❌',err)
    res.status(500).json({msg:'Error enoutered while generating PDF ❌ '})
  }
})

// Set user as admin (protected route - only super admin can do this)
router.put('/set-admin/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isAdmin: true },
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ msg: 'User not found ❌' });
        
        res.status(200).json({ 
            msg: 'User has been set as admin ✅',
            user 
        });
    } catch (err) {
        console.error('Set admin error:', err);
        res.status(500).json({ msg: 'Server error ❌' });
    }
});

// Remove admin status
router.put('/remove-admin/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isAdmin: false },
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ msg: 'User not found ❌' });
        
        res.status(200).json({ 
            msg: 'Admin status has been removed ✅',
            user 
        });
    } catch (err) {
        console.error('Remove admin error:', err);
        res.status(500).json({ msg: 'Server error ❌' });
    }
});

// Get user ID by phone number
router.get('/user-by-phone/:phoneNumber', async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.params.phoneNumber })
            .select('_id fullName phoneNumber email isAdmin');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found ❌' });
        }
        
        res.status(200).json({ user });
    } catch (err) {
        console.error('Error finding user:', err);
        res.status(500).json({ msg: 'Server error ❌' });
    }
});

// Delete user
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found ❌' });
        }
        res.status(200).json({ msg: 'User deleted successfully ✅' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ msg: 'Server error while deleting user ❌' });
    }
});

module.exports = router;

