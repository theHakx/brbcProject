const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
require ('dotenv').config()


const app = express();

app.use(cors())
app.use(express.json());

app.get('/',(req,res) =>{
    res.send('backend initiated bruh...')
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log('MongoDB connected ✅');
        app.listen(PORT, ()=>{
            console.log(`the server is runnin on http://localhost:${PORT}`)
        })
    })
    .catch((err)=>console.log('DB error💥',err))