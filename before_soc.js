const express=require("express");
const fs=require("fs");
const morgan=require("morgan");
const app=express();
const port=3000;

//TODO Adding a Middleware -A function that can modify the incoming Request
//TODO REQUEST <===========> MIDDLEWARE <===========> RESPONSE

//TODO Middlewares
app.use(express.json());


// app.use(morgan('dev'))
app.use(morgan('dev'))

//TODO Step 1-  Creating a New Router and Save it
const tourRouter=express.Router();
const userRouter=express.Router();





//TODO Reading tours.json file Async
//JSON.parse() will convert Array of JSON object to Regular Javascript Array of Object
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,"utf-8"));

//Route Handlers
const getAllTours=(req, res)=>{
  res.status(200).json({
    status:"success",
    statusCode:200,
    results:tours.length,
    data:{
      tours
    },
  })
}

const getTour=(req, res)=>{

  //TODO Using params we have acess to all the parameters  we define :variable
  const id=parseInt(req.params.id);
  const tour=tours.find((item)=>{
    return item.id===id;
  })

  if(id > tours.length){
    res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    })
  }

  if(tour){
    res.status(200).json({
      status:"success",
      responseTime:req.responseTime,
      statusCode:200,
      data:{
        tour
      },
    })
  }
}

const createTour=(req, res)=>{
// Need a Middleware
  console.log("BoDY",req.body);

  const newID=tours[tours.length-1].id+1;
  const newTour=Object.assign({id:newID},req.body)
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{

  })

  res.status(201).json({
    message:"success",
    data:{
      tour:newTour
    }
  });

}

const updateTour=(req, res)=>{


  if(req.params.id*1>tours.length){
    res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    })
  }

  res.status(200).json({
    status:"success",
    data:{
      tour:"Updated Tour "
    }
  })
}

const deleteTour=(req, res)=>{


  if(req.params.id*1>tours.length){
    res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    })
  }

  res.status(204).json({
    status:"success",
    data:null
  })
}


//ROUTES
// app.get("/api/v1/tours",getAllTours);
// app.post("/api/v1/tours",createTour)
app.use((req, res, next)=>{
  console.log("My Created Middleware 💫❤")
  req.responseTime=new Date().toISOString();
  next()
})

// app.use("/api/v1/tours",tourRouter);

// app.route("/api/v1/tours").get(getAllTours).post(createTour)
tourRouter.route("/").get(getAllTours).post(createTour)

// app.route("/api/v1/tours/:id").patch(updateTour).delete(deleteTour).get(getTour)
tourRouter.route("/:id").patch(updateTour).delete(deleteTour).get(getTour)


app.use("/api/v1/tours",tourRouter);





const users=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`,"utf-8"));
console.log("USERS",users);

const getAllUsers=(req,res)=>{
  res.status(200).json({
    status:"success",
    statusCode:200,
    data:{
      users
    }
  })
}
const createNewUser=(req,res)=>{



  res.status(200).json({
    status:"success",
    statusCode:200,
    data:{
      users
    }
  })
}
const getUser=(req,res)=>{

  res.status(500).json({
    status:"failed",
    message:"This Route is Still not implemented"
  })

  const userId=req.params.id*1;
  console.log("USER ID IS ",userId);
  const data=users.find((user)=>{
    return user._id*1===userId
  })

  console.log("DATA ",data);
}
const updateUser=(req,res)=>{
  res.status(500).json({
    status:"failed",
    message:"This Route is Still not implemented"
  })
}
const deleteUser=(req,res)=>{
  res.status(500).json({
    status:"failed",
    message:"This Route is Still not implemented"
  })
}


app.use("/api/v1/users",userRouter);

// app.route("/api/v1/users").get(getAllUsers).post(createNewUser)
userRouter.route("/").get(getAllUsers).post(createNewUser)

// app.route("/api/v1/users/:id").get(getUser).patch(updateUser).delete(deleteUser)
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)


app.listen(port,()=>{
  console.log(`Listening to port ${port}`);
})