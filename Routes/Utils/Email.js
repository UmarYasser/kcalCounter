const nodemailer = require('nodemailer');

exports.sendEmail = async(option)=>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })
    
    const emailOptions = {
        from:'KcalCounter Support<kcalCounter@gmail.com>',
        to:option.email,
        subject:option.subject,
        text:option.message
    }
    await transporter.sendMail(emailOptions);
}

