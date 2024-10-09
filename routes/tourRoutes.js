const express = require('express');
const router=express.Router();

const tourController=require("../controllers/tourController")
const authController = require('../controllers/authController');

/*
* TODO  tourController={getAllTours,getTour,createTour,updateTour}
* */


router.param("id",(req, res, next, value)=>{
  console.log(`The User id in Param is ${value}`);
  next();
})
// router.param("id",tourController.checkId)

router.route("/top-5-tours").get(tourController.aliasToTour,tourController.getAllTours)

router.route("/tour-stats").get(tourController.getToursStats)
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan)

router.route("/")
  // .get(authController.protect,tourController.aliasToTour,tourController.getAllTours)
  .get(authController.protect,tourController.aliasToTour,tourController.getAllTours)
  .post(tourController.createTour)

router.route("/:id")
  .patch(tourController.updateTour)
  .delete(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.deleteTour)
  .get(tourController.getTour)

module.exports=router;