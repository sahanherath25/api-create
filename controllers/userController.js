const fs = require('fs');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8'));

const getAllUsers = catchAsync(async (req, res) => {

  const users = await User.find();

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    results: users.length,
    data: {
      users
    }
  });

});


const createNewUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: {
      users
    }
  });
};
const getUser = (req, res) => {

  res.status(500).json({
    status: 'failed',
    message: 'This Route is Still not implemented'
  });

  const userId = req.params.id * 1;
  console.log('USER ID IS ', userId);
  const data = users.find((user) => {
    return user._id * 1 === userId;
  });

  console.log('DATA ', data);
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This Route is Still not implemented'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This Route is Still not implemented'
  });
};

function filterObj(object, ...allowedFields) {

  //TODO allowedFields is a array contains all the parameters except the 1st parameter

  // Object.keys(object)=>return array containing all the keys of the passed object

  const newObj = {};
  Object.keys(object).forEach((el) => {
    // if(allowedFields.includes(el)){
    //   newObj[el]=object[el]
    // }
    if (allowedFields.includes(el)) newObj[el] = object[el];

  });

  return newObj;


}

const updateMe = async (req, res, next) => {

  //TODO Step 1--> Create Error if user try to update password
  // Checking if th password is containing

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cannot Update the Password Here', 400));
  }

  //TODO Filtering the unwanted fields that do not want to update
  const filterBody = filterObj(req.body, 'name', 'email');

  //TODO Step 2--> Update User Details and Save
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true, runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser
    }
  });

};
//
// const deleteMe = catchAsync(async (req, res, next) => {
//
//     // await User.findByIdAndUpdate(req.user.id, { active: false });
//     //
//     // req.status(204).json({
//     //   status: 'success',
//     //   data: null
//     // });
//
//   }
// );


module.exports = {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
};

