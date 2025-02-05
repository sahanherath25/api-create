const express = require('express');
const router=express.Router();

const reviewController= require('../controllers/reviewsController');
const authController= require('../controllers/authController');

router.route("/")
  .get(reviewController.getAllReviews)
  .post(authController.protect,authController.restrictTo("user"),reviewController.createOneReview)


router.route("/:id").get(reviewController.getOneReview).post(reviewController.createOneReview)


module.exports=router;

