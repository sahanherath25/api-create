const express=require("express");
const fs=require("fs");
const app=express();

const port=3000;

//TODO Adding a Middleware -A function that can modify the incoming Request
//TODO REQUEST <===========> MIDDLEWARE <===========> RESPONSE
app.use(express.json());


//TODO Reading tours.json file Async
//JSON.parse() will convert Array of JSON object to Regular Javascript Array of Object
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,"utf-8"));

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


// app.get("/api/v1/tours",getAllTours);
// app.post("/api/v1/tours",createTour)
app.use((req, res, next)=>{
  console.log("My Created Middleware 💫❤")
  req.responseTime=new Date().toISOString();
  next()
})


app.route("/api/v1/tours").get(getAllTours).post(createTour)


//Sending HTTP Post Request to add new Data
//TODO  PUT  - expect to update the entire object
//TODO PATCH - expect to Only update the properties of current object

// app.get("/api/v1/tours/:id",getTour)
// app.patch("/api/v1/tours/:id",updateTour)
// app.delete("/api/v1/tours/:id",deleteTour)

app.route("/api/v1/tours/:id").patch(updateTour).delete(deleteTour).get(getTour)








app.listen(port,()=>{
  console.log(`Listening to port ${port}`);
})