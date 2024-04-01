const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const nodemailerConfig = require('./nodeMailerConfig')

const sendEmail = async ({ to, subject, html }) => {
    let testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport(nodemailerConfig);

    // transporter.verify(function (error, success) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Server is ready to take our messages");
    //     }
    //   });

    let info =  transporter.sendMail({
        from: '"Jerry Lomak" <jerehlomak@gmail.com>', 
        to,
        subject,
        html,
    })
    console.log("Message sent: %s", info.messageId);
}

const sendrEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: 'tripescape97@gmail.com',
    to,
    subject,
    html,
  };
   sgMail.send(msg)
        .then((response) => console.log('Email sent...'))
        .catch((error) => console.log(error.message)) 
};



module.exports = sendEmail ;
