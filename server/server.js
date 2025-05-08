const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importationof Routes/////////////////////////////////////
const userRoutes = require('./routes/userRoutes'); 
app.use('/api', userRoutes); 

const conferenceInfo = require('./routes/conferenceRoutes')
app.use('/api/conference',conferenceInfo)

const adminRoutes = require('./routes/adminRoutes')
app.use('/api/admin',adminRoutes)

// Test Route
app.get('/', (req, res) => {
  res.send('MongoDB connected ✅');
});

// MongoDB + Server Listen
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log('DB error 💥', err));
