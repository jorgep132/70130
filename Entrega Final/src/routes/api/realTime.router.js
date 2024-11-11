const {Router} = require('express')

const realTime = Router()

realTime.use('/', (req, res)=>{
    res.render('realTime')
})

module.exports = realTime