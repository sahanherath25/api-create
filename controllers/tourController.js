// Route Handlers
const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync=require("../utils/catchAsync")
const AppError = require('../utils/appError');


//TODO Reading tours.json file Async
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,"utf-8"));


// exports.checkBody=(req,res,next)=>{
//
//   if(!req.body.name ||  !req.body.price ){
//     return res.status(400).json({
//       status:"failed",
//       statusCode:400,
//       message:"Missing name or Price Please Check"
//     })
//   }
//   next();
//
// }


exports.aliasToTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summery,difficulty';
  next();
};


exports.getAllTours = catchAsync(async (req, res,next) => {

  console.log('Params ', req.query);
  // const tour=await Tour.find()
  //   .where("duration").equals(5)
  //   .where("difficulty").equals("easy")
  // console.log("FOUNDED OBJECT ",tour);

  // //TODO Getting Shallow Copy
  // const queryObject = { ...req.query };
  // //TODO Creating a array that need to exclude paramters
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // //TODO remove all of the values that do not  have the key from query object
  // excludeFields.forEach((item) => {
  //   return delete queryObject[item];
  // });
  //
  // // TODO Advanced Filtering
  // let queryString = JSON.stringify(queryObject);
  // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  //
  // JSON.parse(queryString);
  // console.log('MODIFIED', queryString);

  // { difficulty: 'medium', duration: { gte: '5' }, limit: '2', page: '45' }
  // { difficulty: 'medium', duration: { $gte: '5' }, limit: '2', page: '45' }
  //gte,gt,lt,lte


  //We have a Query
  // let query = Tour.find(JSON.parse(queryString));
  // //Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   //  If there is no sort parameter
  //   query = query.sort('-createdAt');
  // }


  // 3.Fields Limiting

  // if (req.query.fields) {
  //   const sortByFields = req.query.fields.split(',').join(' ');
  //   console.log('Fields ', sortByFields);
  //   //TODO To do that here MongoDB expect string like ' name duration difficulty price '
  //   query = query.select(sortByFields);
  // } else {
  //   query = query.select('-_v');
  // }


  //4. Pagination

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  //
  // //Logic to get the page and limit
  // const skip = (page - 1) * limit;
  //
  // //TODO page 2& limit=10
  //
  // //TODO 1-10 page 1 |11-20 page 2 |21-30 page 3
  // query = query.skip(skip).limit(limit);
  //
  // if (req.query.page) {
  //   //TODO return a promise with all the counts and execute query with results
  //   const numOfTours = await Tour.countDocuments();
  //   if (skip >= numOfTours) {
  //     throw new Error('This page is not Exists');
  //   }
  // }
  //By Awaiting it will execute and return with matching results
  // With All Filtration  apply finally execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    results: tours.length,
    data: {
      tours
    }
  });


});

exports.getTour = catchAsync(async (req, res,next) => {

  console.log('ID ', req.params.id);

  const tour = await Tour.findById(req.params.id);
  //  TODO Tours.findOne({_id:req.params.id})

  if(!tour){
    return next(new AppError("Page Not Found",404))
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: {
      tour
    }
  });



  //TODO Using params we have acess to all the parameters  we define :variable
  const id = parseInt(req.params.id);

  // const tour=tours.find((item)=>{
  //   return item.id===id;
  // })
  //
  // if(tour){
  //   res.status(200).json({
  //     status:"success",
  //     responseTime:req.responseTime,
  //     statusCode:200,
  //     data:{
  //       tour
  //     },
  //   })
  // }
});

//To catch the error on Async Await Function
// const catchAsync = fn => {
//   return (req, res, next)=>{
//     // fn(req, res, next).catch(err=>next(err));
//     fn(req, res, next).catch(next);
//   }
// };

exports.createTour = catchAsync(async (req, res, next) => {


    const newTour = await Tour.create(req.body);



  // if(!newTour){
  //   return next(new AppError("Page Not Found",404))
  // }

  res.status(201).json({
      message: 'success',
      data: {
        tour: newTour
      }
    });
});

exports.updateTour = catchAsync(async (req, res,next) => {

  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    message: 'success',
    data: {
      updatedTour
    }
  });

});

exports.deleteTour =catchAsync( async (req, res,next) => {

  const tour = await Tour.findByIdAndDelete(req.params.id);

  if(!tour){
    return next(new AppError("Page Not Found",404))
  }


  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getToursStats = catchAsync(async (req, res) => {

  const stat = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTOurs: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    /*      {
            $match:{_id:{$ne:"EASY"}}
          }*/
  ]);

  console.log('Stats', stat);

  res.status(200).json({
    status: 'success',
    data: stat
  });


});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {

  const year = req.params.year * 1;
  console.log(year);

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match:
        {
          startDates:
            {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
        }
    },
    {
      $group:
        {
          _id: { $month: '$startDates' },
          numOfTours: { $sum: 1 },
          tours: { $push: '$name' }
        }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numOfTours: -1 }
    }
    // {
    //   $limit:2
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: plan
  });

});

// module.exports={
//   getTour,getAllTours,createTour,updateTour,deleteTour
// }