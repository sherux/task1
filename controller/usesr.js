const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/usesrdb");
const Token = require("../models/tokendb");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const { registervalidation, loginvalidation } = require("../validation/valid");

// ------------------------------send mail----------------------------------
const sendresetpassword = async (email, token) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",

      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.emailuser,
        pass: process.env.emailpassword,
      },
    });

    const link = `http://localhost:3000/api/users/Reset-password?${token}`;
    console.log(link);
    const mailoptions = {
      from: process.env.emailuser,
      to: email,
      subject: "for Reset password",
      text: link,
    };
    transporter.sendMail(mailoptions, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("mail has been sent:", info.response);
      }
    });
  } catch (err) {
    // console.log(err.message);
  }
};

//---------------------------- authentication--------------------------------------------
const auth = (req, res) => {
  res.json(req.users);
};

// ---------------------------getall data-------------------------------------------
const getalldata = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};
//---------------------------------------get a one data-------------------------------------
const getonedata = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err.message);
  }
};
//---------------------------- employee register and create data-----------------------
const registerdata = async (req, res) => {
  const { error } = registervalidation(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  //checking email exist or not
  const emailexist = await User.findOne({ email: req.body.email });
  if (emailexist)
    return res.status(400).json({ message: "email alredy exists" });

  // hashpassword
  const hashpassword = await bcrypt.hash(req.body.password, 12);

  const users = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashpassword,
    mobile: req.body.mobile,
    gender: req.body.gender,
    country: req.body.country,
    city: req.body.city,
    img: req.file.location,
  });
  try {
    const user1 = await users.save();
    res.status(200).json({ user1, file: req.file });
  } catch (err) {
    res.status(400).json(err);
  }
};

// -----------------------------------employe a login--------------------------------------
const logindata = async (req, res) => {
  const { error } = loginvalidation(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }
  //checking email exist or not
  const users = await User.findOne({ email: req.body.email });
  if (!users) return res.status(400).json("email is not found");
  //   password check
  const validpass = bcrypt.compare(req.body.password, users.password);
  if (!validpass) return res.status(200).json("invalid password");

  // ------------------------------create token and assign--------------------------------------

  const token = jwt.sign({ id: users.id }, process.env.SECRET_TOKEN, {
    expiresIn: "3h",
  });
  res
    .header("auth-token", token)
    .json({ message: "login successfully", token: token });
};

// -----------------------------------update data----------------------------------------------
const UpdateData = async (req, res) => {
  try {
    const users = {
      mobile: req.body.mobile,
      gender: req.body.gender,
      country: req.body.country,
      city: req.body.city,
      img: req.file.locatrion,
    };
    const updatedusers = await User.findByIdAndUpdate(req.params.id, users);
    res.status(200).json("data is succesfully updated");
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// -----------------------------------delete data-----------------------------------------------
const DeleteData = async (req, res) => {
  try {
    const deletusers = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("data is delete");
  } catch (err) {
    res.status(400).json(err.message);
  }
};
// ------------------------------------------forget password-----------------------------------
const forgetpassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // if(!user) return  res.status(400).json("email not exist")
    // const token=await Token.findOne({userId:User.id})
    // if(!token){
    //   token=await new Token({
    //     userId:User.id,
    //     token:crypto.randomBytes(32).toString('hex')

    //   }).save()
    // }
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.PASS);

      const data = await User.updateOne(
        { email: req.body.email },
        { $set: { token: token } }
      );

      await sendresetpassword(user.email, token);
      res.status(200).json({ message: "check your email" });
    } else {
      res.status(200).json({ message: "email not found" });
    }
  } catch (err) {
    // res.status(400).json(message.err);
  }
};
// ---------------------------------reset password------------------------------------
const resetpassword = async (req, res) => {
  try {
    const token = req.query.token;
    const tokendata = await User.findOne({ token: token });
    if (tokendata) {
      const password = req.body.password;
      const newpassword = await bcrypt.hash(password, 12);
      const usernewdata = await User.findByIdAndUpdate(
        { _id: tokendata._id },
        { $set: { password: newpassword, token: "" } },
        { new: true }
      );
      usernewdata.save();
      console.log(usernewdata, "usernewdata");
      res
        .status(200)
        .json({ message: "user password updated", data: usernewdata });
    } else {
      res.status(200).json({ message: "link is expired" });
    }
  } catch (err) {
    res.status(400).json(message.err);
  }
};
//  ------------------------------------------------ module export----------------------------------
module.exports = {
  auth,
  getalldata,
  getonedata,
  registerdata,
  logindata,
  UpdateData,
  DeleteData,
  forgetpassword,
  resetpassword,
};
