const nodemailer = require("nodemailer");

const sendEmail = async (email, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    // const link = `http://localhost:3000/api/users/Reset-password?${token}`;
    // console.log(link);
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "password reset",
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
