const nodemailer = require('nodemailer');

exports.mailSender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from:"Royal FruitNuts",
            to:email,
            subject:title,
            html:body
        })

        console.log("Mail Sender Info",info)
        return info;
    }catch(error){
        console.log("Error while sending mail",error.message);
    }
}

module.exports = mailSender;