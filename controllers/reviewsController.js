const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {

  const params = req.params;
  const query = req.query;

  console.log('PARAMS ', params);
  console.log('Query ', query);
  console.log('Request Body  ', req.body);


  try {

    const reviewData = await Review.find(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        reviewData
      }
    });


  } catch (e) {

    console.log('Error ', e);
    res.status(404).json({
      status: 'fail',
      message: 'Not Found'
    });

  }


  // next()
});

exports.getOneReview = catchAsync(async (req, res, next) => {

  try {
    const reviewData = await Review.findById(req.params.id).populate({
      path: 'user',
      select: 'name -_id'
    }).populate({
      path: 'tour',
      select: 'name -guides '

    });

    res.status(200).json({
      status: 'success',
      data: {
        reviewData
      }
    });

  } catch (e) {

    console.log('Error ', e);
    res.status(404).json({
      status: 'fail',
      message: 'Not Found'
    });

  }

});

exports.createOneReview = catchAsync(async (req, res, next) => {

  try {
    const review = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: review
      }
    });
  } catch (e) {

    console.log('Error ', e);
    res.status(401).json({
      status: 'fail',
      error: e
    });
  }

});