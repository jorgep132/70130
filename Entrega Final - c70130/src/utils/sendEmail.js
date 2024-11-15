const {createTransport} = require('nodemailer')
const { configObject } = require('../config')

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }
})

exports.sendEmail = async ({userClient='', subject='', html=''}) => {
    const destinario =  userClient
    await transport.sendMail({
        from: `Trabajo Final c70130 <${configObject.gmail_user}`,
        to: destinario,   
        subject: subject,
        html: html,
    })
}
