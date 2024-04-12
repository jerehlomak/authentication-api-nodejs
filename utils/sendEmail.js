const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const nodemailerConfig = require('./nodeMailerConfig')

const sendEmail = async ({ to, subject, html }) => {

    const transporter = nodemailer.createTransport(nodemailerConfig);

    let info =  transporter.sendMail({
        from: '"Tripescape" <jerehlomak@gmail.com>', 
        to,
        subject,
        html,
    })
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
