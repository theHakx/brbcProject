const express = require('express');
const User = require('../models/User');
const sendEmail = require('../utils/mailer')
const PDFDocument = require('pdfkit')
const path = require('path')
const router = express.Router();

// GET all users (for admin dashboard)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // this excludes the password pretty cool
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error while trying to fetch users fetching users' });
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
      { new: true }
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

      await sendEmail(
        user.email,
        'Your confference ticket',
        `<p>Hello ${user.fullName},
        <p>Thank you for registering and paying for the confference</p>
        <p>Your ticker number is <strong>${user.ticket}</strong></p>
        <p>See you soon!</p>
        </p>`
        
      )

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


module.exports = router;
