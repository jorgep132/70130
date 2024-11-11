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
    console.log('Persona que recibe el mail:', destinario)
    await transport.sendMail({
        from: `Coder test <${configObject.gmail_user}`,
        to: destinario,   
        subject: subject,
        html: html,
    })
    console.log('Correo enviado a: ', destinario);
}
