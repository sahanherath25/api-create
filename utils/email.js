const nodemailer=require("nodemailer");

const sendEmail=async (options)=>{

//  TODO Create mail transporter
  const transporter=nodemailer.createTransport({
    // service:"Gmail",//Yahoo,Hotmail

    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
  })
//  TODO Define Email option

  const mailOption={
    from:`Sahan HErath <sahanherath25@gmail.com>`,
    to:options.email,
    subject:options.subject,
    text:options.message
    // html:
  }

//  TODO Actually Send Email
 await transporter.sendMail(mailOption)
}

module.exports=sendEmail