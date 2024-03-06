const User = require("../models/User");
const Video = require("../models/Video");
const nodemailer = require("nodemailer");

async function sendEmailToGmail(req,res) {
  const { email,name,message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_EMAIL_ID,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const mail = {
    from: email,
    to: process.env.GMAIL_URL,
    subject: "Feedback : "+name,
    text: message,
  };
  await transporter.sendMail(mail);
  return res.status(200).send("Email Send Successfull");
}


//get a user
async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(404).send('User Not Found');
  }
  res.status(200).send(user);
}
//delete a user
async function deleteUser(req, res) {
  if (req.params.id == req.user.id) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User has been deleted");
  } else {
    return res.status(403).send("You can delete only your Account");
  }
}
//update user details
async function updateUser(req, res) {
  if (req.params.id == req.user.id) {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } else {
    return res.status(403).send("You can update only your Account");
  }
}
//subscribe to a channel
async function subscribe(req, res) {
    console.log("User Id : ",req.user.id);
    console.log("Channel Id : ",req.params.id);
    await User.findByIdAndUpdate(req.user.id,{$push:{subscribedChannels:req.params.id}});
    await User.findByIdAndUpdate(req.params.id , {$push:{subscribers:req.user.id}});
    res.status(200).send('Successfully Subscribed');
}
//unsubscribe to a channel
async function unSubscribe(req, res) {
  console.log("User Id : ",req.user.id);
  console.log("Channel Id : ",req.params.id);
  await User.findByIdAndUpdate(req.user.id,{$pull:{subscribedChannels:req.params.id}});
  await User.findByIdAndUpdate(req.params.id , {$pull:{
    subscribers:req.user.id
  }});
  res.status(200).send('Unsubscribed');
}

module.exports = {
  getUser,
  deleteUser,
  updateUser,
  subscribe,
  unSubscribe,
  sendEmailToGmail
};
