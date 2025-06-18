const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function setAdmin(phoneNumber) {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB ✅');

        // Find and update the user
        const user = await User.findOneAndUpdate(
            { phoneNumber },
            { isAdmin: true },
            { new: true }
        ).select('-password');

        if (!user) {
            console.log('❌ User not found with phone number:', phoneNumber);
            return;
        }

        console.log('✅ User set as admin successfully:');
        console.log('Name:', user.fullName);
        console.log('Phone:', user.phoneNumber);
        console.log('Email:', user.email);
        console.log('Admin status:', user.isAdmin);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Get phone number from command line argument
const phoneNumber = process.argv[2];
if (!phoneNumber) {
    console.log('❌ Please provide a phone number as an argument');
    console.log('Usage: node setAdmin.js <phone-number>');
    process.exit(1);
}

setAdmin(phoneNumber); 