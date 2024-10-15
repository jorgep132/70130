const {Router} = require('express')

const realTimeProducts = Router()

realTimeProducts.use('/', (req, res)=>{
    res.render('realTimeProducts')
})

module.exports = realTimeProducts