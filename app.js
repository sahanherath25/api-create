const express=require("express");
const morgan=require("morgan");
const cors = require('cors');
const app=express();
const rateLimit=require("express-rate-limit");
const helmet=require("helmet")

const mongoSanitize=require("express-mongo-sanitize")
const xss=require("xss-clean")
const hpp=require("hpp")

// Use CORS middleware
app.use(cors());
app.use(helmet());


// app.use((req, res, next)=>{
//   // TODO Handling Uncaught Exceptions
//   console.log(sahan);
// })

//TODO If environemnt is development then use morgan
if(process.env.NODE_ENV==="development"){
  app.use(morgan('dev'))
}

//Creating a Rate Limiter
const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too many request to the server from this IP,Please try again in 1 Hour"
})

//
app.use("/api",limiter)

//TODO Body parser -->Reading data from the body into req.body
//TODO Limiting the data that come into body

app.use(express.json({limit:"10kb"}));

//TODO Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

//TODO Data Sanitization against XSS
app.use(xss());

//Preventing Parameter Pollution
app.use(hpp({
  whitelist:["duration","difficulty"]
}));


app.use(express.static(`${__dirname}/public`));

//TODO Importing Routers
const tourRouter=require("./routes/tourRoutes")
const userRouter=require("./routes/userRoutes")
const reviewRouter=require("./routes/reviewRouter")
const AppError = require('./utils/appError');

const globalErrorHandler=require("./controllers/errorControllers")

//TODO Mounting Routers
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/reviews",reviewRouter);

app.all("*",(req, res, next)=>{
  // res.status(404).json({
  //   status:"Failed",
  //   message:`Path Could Not Find ${req.originalUrl} on our server`,
  // })

  // const error=new Error(`Path Could Not Find ${req.originalUrl} on our server\``)
  // error.status="Fail"
  // error.statusCode=401

  next(new AppError(`Path Could Not Find ${req.originalUrl} on our server`,401))

})


app.use(globalErrorHandler)

module.exports=app


//Cluster Logins
// pwd=6kCZluNRUDihAxjU
// userName=sahanherath555

//URL -mongodb+srv://sahanherath555:6kCZluNRUDihAxjU@cluster0.5pfwjyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//string=mongodb+srv://sahanherath555:<password>@cluster0.5pfwjyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//DATABASE=mongodb+srv://sahanherath555:6kCZluNRUDihAxjU@cluster0.5pfwjyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//mongodb+srv://sahanherath555:6kCZluNRUDihAxjU@cluster0.5pfwjyr.mongodb.net/natours/?retryWrites=true&w=majority&appName=Cluster0