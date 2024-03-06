const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    videos: {
      type: [String],
    },
    subscribers: {
      type: [String],
    },
    subscribedChannels: {
      type: [String],
    },
    profileImageUrl: {
      type: String,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.verifyPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
}

userSchema.methods.generateToken = function (user) {
  const token = jwt.sign({ id: user._id , name: user.name }, process.env.JWT_KEY, {
      expiresIn:  process.env.TOKEN_EXPIRY ,
  });
  return token;
}

userSchema.statics.createHashedPassword = function (pass) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pass, salt);
  return hash;
}

userSchema.methods.getForgotPasswordToken = function () {
  const tokenString = crypto.randomBytes(25).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(tokenString)
    .digest("hex");
  const expirationTime = new Date();
  expirationTime.setMilliseconds(
    expirationTime.getMilliseconds() + process.env.FORGOT_PASSWORD_EXPIRY
  );
  this.forgotPasswordExpiry = expirationTime;
  return tokenString;
};
const User = mongoose.model("User", userSchema);

module.exports = User;