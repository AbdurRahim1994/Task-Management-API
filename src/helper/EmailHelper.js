const nodemailer = require('nodemailer')

exports.SendMail = async (EmailTo, EmailText, EmailSubject) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        //host: 'mail.teamrabbil.com',
        //port: 25,
        host:'smtp.gmail.com',
        port:465,
        secure: false,
        auth: {
            user: 'rahim.abdurdu16292014@gmail.com',
            pass: 'lgeqwuqoukgxcvwk'

            // user: "info@teamrabbil.com",
            // pass: '~sR4[bhaC[Qs'
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    let options = {
        //from: 'Task Manager MERN <info@teamrabbil.com>',
        from: 'Task Manager MERN <rahim.abdurdu16292014@gmail.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    }

    return await transporter.sendMail(options)
}