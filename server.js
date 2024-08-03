const mongoose=require("mongoose");

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
}).catch((reason)=>{
  console.error("ERROR ",reason);
})
const app=require("./app")
const port=process.env.PORT||3000;
console.log("MODE ",process.env.NODE_ENV);

app.listen(port,()=>{
  console.log(`Listening to port ${port}`);
})


