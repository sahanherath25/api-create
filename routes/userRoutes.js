const express = require('express');

const userController=require("../controllers/userController")
const authController = require('../controllers/authController');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

const router=express.Router();

router.post("/signup",authController.signUp);
router.post("/login",authController.login);

router.post("/forgotPassword",authController.forgotPassword);
router.patch("/resetPassword/:token",authController.resetPassword);

router.patch("/updateMyPassword",authController.protect,authController.updatePassword);

router.patch("/updateMe",authController.protect,userController.updateMe);

router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)

router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports=router;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmZmNjQ2MGNiNzllODNkOGE2MTZlNCIsImlhdCI6MTcyMzg1NjQ1NSwiZXhwIjoxNzMxNjMyNDU1fQ.6Yd1Ih3xIsmus_M4XJ6DeMCKt3SMSbq7wZn6Ww467Y8