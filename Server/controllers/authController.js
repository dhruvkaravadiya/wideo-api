const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// async function signup(req, res) {
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(req.body.password, salt);
//   const newUser = new User({ ...req.body, password: hash });
//   await newUser.save();
//   console.log(req.body);
//   res.status(200).send("User Created Successfully");
// }

async function signup(req, res) {
  // Validate request data
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Name, Email, and Password are required");
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(401).json({ message: "Email is already in use" });
  }
  // Create hashed password and user object
  const hashedPassword = User.createHashedPassword(req.body.password);
  const user = new User({
    ...req.body,
    password: hashedPassword,
  });
  // Save user and send email
  await user.save();
  const token = user.generateToken(user);
  // Set cookie and respond
  res
    .status(200)
    .cookie("access_token", token, {
      expiresIn: new Date(Date.now() + process.env.TOKEN_EXPIRY),
    })
    .json({ success: true, access_token: token, user: user });
}

async function signin(req, res) {
  const user = await User.findOne({
    $or: [{ name: req.body.name }, { email: req.body.email }],
  });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  const isPasswordCorrect = await user.verifyPassword(req.body.password);
  if (!isPasswordCorrect) {
    return res.status(400).send("Password is incorrect");
  }
  const token = jwt.sign({ id: user._id , name: user.name }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  const { password, ...otherProperties } = user._doc;
  console.log("Login Success");

  res
    .status(200)
    .cookie("access_token", token, { httpOnly: true })

    .json({ success: true, access_token: token, user: otherProperties });
}

async function logout(req, res) {
  res.cookie("access_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Successful Logout" });
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("Email was not registered");
  }

  const forgotPasswordToken = user.getForgotPasswordToken();
  user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://localhost:1234/#/resetpassword/${forgotPasswordToken}`;
  const message = `Follow this link \n\n ${url}`;
  try {
   const transporter = nodemailer.createTransport({
     service: "Gmail",
     auth: {
       user: process.env.GMAIL_EMAIL_ID,
       pass: process.env.GMAIL_APP_PASSWORD,
     },
   });
   const mail = {
     from: process.env.GMAIL_URL,
     to: email,
     subject: "Reset Password",
     text: message,
   };
   await transporter.sendMail(mail);
    res
      .status(200)
      .json({
        success: true,
        message: "Email Sent Successfully",
        token: forgotPasswordToken,
      });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).send(error.message);
  }
}

async function resetPassword(req, res) {
  const token = req.params.token;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryptedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Token invalid or expired");
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).send("Password and Confirm Password do not match");
  }

  // Update the user's password
  user.password = await User.createHashedPassword(req.body.password);
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res
    .cookie("access_token", token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + process.env.TOKEN_EXPIRY),
    })
    .status(200)
    .json({ success: true, message: "Password Reset Successfull" });
}
module.exports = { signup, signin, logout, forgotPassword, resetPassword };
