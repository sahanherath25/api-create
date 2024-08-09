const mongoose=require("mongoose");

process.on("uncaughtException",(error)=>{
  console.error("ERROR Name ",error.name);
  console.error("ERROR Message ",error.message);
  process.exit(1)
  // server.close(()=>{
  //   console.log("Server Disconnecting");
  //   console.log('Good Bye Folks :)');
  //
  // })
})

const dotenv=require("dotenv")
dotenv.config({
  path:"./config.env"
})

const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
}).then((con)=>{

  console.log("Connected To MongoDB Atlas ");
})

// }).catch((reason)=>{
//   console.error("ERROR ",reason);
// })
const app=require("./app")
const port=process.env.PORT||3000;
console.log("MODE ",process.env.NODE_ENV);

// app.listen(port,()=>{
//   console.log(`Listening to port ${port}`);
// })

const server=app.listen(port,()=>{
  console.log(`Listening to port ${port}`);
})


process.on("unhandledRejection",(error)=>{

  console.error("SAHAN ERROR OCCURED");
  console.log("error",error.name);
  console.error("MEssage",error.message);

  //CLOSING THE SERVER 1st
  server.close(()=>{
    console.log("Closing Server ");
    //Closing the App
    process.exit(1)
  })

})




// process.on("uncaughtException",(error)=>{
//   console.error("ERROR Name ",error.name);
//   console.error("ERROR Message ",error.message);
//   server.close(()=>{
//     console.log("Server Disconnecting");
//     console.log('Good Bye Folks :)');
//     process.exit(1)
//   })
// })


