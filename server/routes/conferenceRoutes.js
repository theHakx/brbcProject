const express = require('express')
const router = express.Router()

router.get('/info',(req,res)=>{
    const conferenceInfo = {
        title: "Trusting God's plan for our lives",
        speaker1 : {
            name: 'Tim Challies',
            church: 'Grace Fellowship Church',
            location: 'Toronto, Canada'
        },
        speaker2 : {
            name: 'John Bell',
            church: 'Covenaters Christian Chruch',
            location: 'Harare, Zimbabwe'
        },
        dates : {
            date1 : {
                date : 'Friday 28 November 2025',
                time : '18:30 - 20:00'
            },
            date2 : {
                date : 'Saturday 29 November 2025',
                time : '08:30 - 16:00',
            },
            date3 : {
                date : 'Sunday 30 November 2025',
                time : '09:00 - 12:00'
            }
        },
        EcoCashPhoneNumber : '+263788710804'
    }
    res.status(200).json(conferenceInfo)
})

module.exports = router