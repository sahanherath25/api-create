const AppError = require('../utils/appError');
const sendErrorDev=(res,err)=>{
    res.status(err.statusCode).json(
      {
        status: err.status,
        message: err.message,
        code: err.statusCode,
        stack:err.stack,
        error:err
      }
    )
}

const handleCastErrorDB=(error)=> {
  const message=`Invalid ${error.path}  ${error.value}`
  return new AppError(message,400)
}

const sendErrorProd=(res,err)=>{

  //OPERATIONAL Trusted Error Send to the client
  if(err.isOperational){
    res.status(err.statusCode).json(
      {
        status: err.status,
        message: err.message,
        code: err.statusCode,
      }
    )
  //  Programming or Other unknown error don't expose to Client
  }else {
    console.error("ERROR ",err);
    res.status(400).json({
      status: "Error",
      message: err,
      error:err
    })
  }

}

// process.env.NODE_ENV="production"

function handleDuplicateFieldsDB(error) {
  let value=error.message.match(/(["'])(\\?.)*?\1/)[0]
  const  message=`Duplicate value for ${value} Please use Another Name`
  return new AppError(message,400)
}


const  handleValidationError=(err)=>{

  const errors=Object.values(err.errors).map((errObj)=>errObj.message)

  const  message=`Invalid Input  ${errors.join(". ")} Please use Another Name`

  console.log(message);
  // console.log("ERROR OBJECTS ARRAY",errors);
  // //
  return new AppError(errors,400)

}


const  handleJWTError=error=> new AppError("Invalid Token Please Login Again",401)

const  handleTokenExpiredError=error=> new AppError("Token Issued Was Expired Please Login Again",401)


module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

   //TODO Checking the Mode
   if(process.env.NODE_ENV==="development"){
     console.log('DEV ERROR ',process.env.NODE_ENV);
     //TODO Show more error details
     sendErrorDev(res,err)

   }else if(process.env.NODE_ENV==="production") {
     console.log('PRODUCTION ERROR ',process.env.NODE_ENV);

     let error=err
     if(error.name==="CastError") error=handleCastErrorDB(error)
     if(error.code===11000) error=handleDuplicateFieldsDB(error);
     if(error.name==="ValidationError") error=handleValidationError(error);
     if(error.name==="JsonWebTokenError") error=handleJWTError(error);

     if(error.name==="TokenExpiredError") error=handleTokenExpiredError(error);

     // if(error.name==="ValidationError") error=error.message

     sendErrorProd(res,error)
   }
};



