const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const hbs = require('nodemailer-handlebars');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL_SENT,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        partialsDir: './utils/',
        defaultLayout: '',
      },
      viewPath: './utils/',
      extName: '.hbs',
    })
  );

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.GMAIL_SENT}>`, // sender address
    to: options.email,
    subject: options.subject,
    text: options.message,
    template: 'index',
    context: {
      name: options.name,
      otp: options.otp,
    }, // send extra values to template
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
