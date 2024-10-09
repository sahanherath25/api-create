const express=require("express");
const fs=require("fs");
const app=express();

const port=3000;

//TODO Adding a Middleware -A function that can modify the incoming Request
app.use(express.json());

//TODO REQUEST <===========> MIDDLEWARE <===========> RESPONSE

// app.get("/",(req, res)=>{
//   console.log(req.url);
//   res.status(403).json({message:"RESPONDING  HELLO FROM THE SERVER SIDE",app:"Natour"})
// })
//
// app.post("/",(req, res)=>{
//   console.log(req.url);
//   res.send("You can send this for post requests....")
// })

//TODO Reading tours.json file Async

//JSON.parse() will convert Array of JSON object to Regular Javascript Array of Object
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,"utf-8"));

console.log("TOURS DATA",tours);

app.get("/api/v1/tours",(req, res)=>{
  res.status(200).json({
    status:"success",
    statusCode:200,
    results:tours.length,
    data:{
      tours
    },
  })
});

//Sending HTTP Post Request to add new Data
app.post("/api/v1/tours",(req, res)=>{
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

})

app.get("/api/v1/tours/:id",(req, res)=>{

  //TODO Using params we have acess to all the parameters  we define :variable


  const id=parseInt(req.params.id);

  // console.log("Params  ", req.params);
  //
  // console.log("Params ", current);
  // console.log("Type ", typeof current);

  const tour=tours.find((item)=>{
    return item.id===id;

  })

  // console.log("DATA ",data);

  if(id > tours.length){
    res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    })
  }

  if(tour){
    res.status(200).json({
      status:"success",
      statusCode:200,
      data:{
        tour
      },
    })
  }

})

//TODO  PUT  - expect to update the entire object
//TODO PATCH - expect to Only update the properties of current object


app.patch("/api/v1/tours/:id",(req, res)=>{


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
})


//TODO Delete Method
app.delete("/api/v1/tours/:id",(req, res)=>{


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
})

app.listen(port,()=>{
  console.log(`Listening to port ${port}`);
})