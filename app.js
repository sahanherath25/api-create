const express=require("express");
const morgan=require("morgan");
const app=express();



app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if(process.env.NODE_ENV==="development"){
  //TODO If environemnt is development then use morgan
  app.use(morgan('dev'))
}



//TODO Importing Routers
const tourRouter=require("./routes/tourRoutes")
const userRouter=require("./routes/userRoutes")
const AppError = require('./utils/appError');

const globalErrorHandler=require("./controllers/errorControllers")



//TODO Mounting Routers
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);



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