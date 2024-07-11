const nodeMailer = require("nodemailer");

const sendEmail = async(options)=>{
    
    const transporter = nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        service:process.env.SMTP_SERVICE,
        port:465,
        secure:true,
        logger:true,
        debug:true,
        secureConnection: false,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        },
        tls:{
            rejectUnAuthorized:true
        }
    })

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    };


    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;