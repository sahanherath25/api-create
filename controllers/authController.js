const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { token } = require('morgan');
const crypto=require("crypto")

const { promisify } = require('util');
const sendEmail = require('../utils/email');

const signIn = (id) => {
  console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

  return jwt.sign({ id }, process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN });

};


const createAndSendToken=(user,statusCode,res)=>{

  const token = signIn(user._id);

  res.status(statusCode).json(
    {
      status: 'success',
      token,
      data: {
        user: user
      }
    }
  );


}

exports.signUp = catchAsync(async (req, res, next) => {

  //TODO Creating new User
  // const newUser=await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  const token = signIn(newUser.id);

  res.status(200).json(
    {
      status: 'success',
      token,
      data: {
        user: newUser
      }
    }
  );

});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  if (!email || !password) {
    return next(new AppError('Please Provide EmailAnd Password', 400));
  }

  //TODO Check if the User Exists in DB
  const user = await User.findOne({ email }).select('+password');

  // if (!user || !correct) {
  //   return next(new AppError('User Not Found on Our Database', 401));
  // }

  if (!user || !(await user.correctPassword(password, user.password))) {

    if (!user) {
      return next(new AppError('Your email provided is  not Found on Our Database', 401));
    } else {
      return next(new AppError('Password is not matching Please Check', 401));
    }
  }

  const token = signIn(user._id);

  //IF everything OK send Token
  res.status(200).json(
    {
      status: 'success',
      token
    }
  );


});

exports.protect = catchAsync(async (req, res, next) => {
  //TODO Check if the token is there
  console.log('Headers', req.headers);
  console.log('TEST HEADER ', req.headers.authorization);

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //  Extracting the token value in header
    //   token=req.headers.authorization.replace("Bearer","").trim();
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('TOKEN', token);

  if (!token) {
    return next(new AppError('You are not LoggedIn Please Login to Acess the Page', 401));
  }

  console.log('ERROR SAHABN');
  //TODO Step 2 Validate Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  console.log('DECODED', decoded);

  //TODO Check if User Still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    //TODO
    return new AppError('The Token Belong to this user is No longer Exists', 403);
  }

  //TODO Check  If user changes pwd after issue JWT

  // console.log("REQUESTING " ,currentUser.changedPasswordAfter(decoded.iat))
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently Changed the password Please login Again', 403));
  }
  console.log('USER IS AUTHENTICATED is  ', currentUser.name);
  req.user = currentUser;
  next();

});

exports.restrictTo = (...roles) => {

  console.log('ROLE ARRAY ', roles);

  return (req, res, next) => {
    console.log('IN the restrict mode SAHAN ');

    console.log('ROLE ', req.user.role);
    console.log('RESULT', roles.includes(req.user.role));

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized Access ', 403));
    }

    console.log('ADMIN SUPER POWER');

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
//  TODO Get User Email by req body
  const user = await User.findOne({ email: req.body.email });

  console.log('USER FOUND IS ', user);
  if (!user) {
    return next(new AppError('Email Not Found', 404));
  }

//  TODO Generate random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log('USER FOUND IS ', user);
  console.log('TOEKN ', resetToken);

  //  TODO send it to users email

  //  TODO Here we sending the plain token then we compare with encrypt one with dm
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  console.log("HOST PROTOCOOL ",req.protocol);
  console.log("URL",resetUrl);
  console.log("URL",req.protocol);


  const message = `Forgot YOur Password Submit  a Patch request with your new password  and
   passwordConfirm to ${resetUrl} if you dont reset your password contact admin and ignore email`;

  console.log("message",resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your reset Token only valid 10 mains',
      message
    });

    res.status(200).json({
      status: 'success',
      data: 'Token send to email'
    });

  } catch (e) {
    user.PasswordResetToken=undefined
    user.PasswordResetExpires=undefined
    await user.save({validateBeforeSave:false})

    console.log("ERROR ",e);
    return  next(new AppError("Error while reset Password",500))
  }

};

exports.resetPassword = catchAsync( async (req,res,next) => {

  //Get hre User Based Token from param and encrypt
  const pureToken=req.params.token;
  const hashedToken=crypto.createHash("Sha256").update(pureToken).digest("hex")

//  TOKEN Getting the user with HashedToken
  const user=await User.findOne({ PasswordResetToken:hashedToken, PasswordResetExpires:{$gte:Date.now()} })

  // TODO  Step 2.-->IF the token is not expired and the user is there set new password
  if(!user){
    return next(new AppError("User not Found or Token is expired ",400))
  }

  console.log("USER FOUND ",user);

  //TODO modifying the password with new  details
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;

//  TODO Deleting the reset token and reset time
  user.PasswordResetToken=undefined
  user.PasswordResetExpires=undefined

//  TODO Save in DB
  await user.save()

//  TODO update the changedPassword value in the User Database


//  TODO Step 1 -->  Login the User and Sigin In

  const token = signIn(user._id);

  //IF everything OK send Token
  res.status(200).json(
    {
      status: 'success',
      token
    }
  );



});

exports.updatePassword=async (req,res,next)=>{

  console.log("FUCK YOU EZKEUL");

  console.log("email",req.user.email);
  console.log("currentPwd",req.body.passwordCurrent);
  console.log("email",req.body.passwordConfirm);

//  TODO Step 1-->Getting the user
//   const user=await User.findOne({email:email}).select("password")

  const user = await User.findById(req.user.id).select('+password');
  console.log("USER FOUND ",user);
//  TODO Check if the pwd is correct

  // const user = await User.findOne({ email }).select('+password');

  // if (!user || !correct) {
  //   return next(new AppError('User Not Found on Our Database', 401));
  // }


  if (!user || !(await user.correctPassword(req.body.passwordCurrent, user.password))) {

    if (!user) {
      return next(new AppError('Your email provided is  not Found on Our Database', 401));
    } else {
      return next(new AppError('Password is not matching Please Check', 401));
    }
  }
  console.log("Login Credential Matching SUCCESS SAHAN");
//  TODO If correct  allow to change pwd

  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  await user.save()

//  TODO Login User Again

  createAndSendToken(user,200,res)
  
}



