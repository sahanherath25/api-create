const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../model/tourModel');

//TODO TO Read the environment variables file
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{

}).then(()=>{
  console.log("Connected TO DB Sucessfully");
}).catch((e)=>{
  console.log("ERROR",e);
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully Loaded");

  } catch (e) {
    console.log('ERROR ', e);
  }

  process.exit()
};

//DELETE ALL DATA FROM Tour Collection
const deleteData=async ()=>{

  try {
    await Tour.deleteMany();
    console.log("Data Deleted Loaded");

  } catch (e) {
    console.log('ERROR ', e);
  }

  process.exit()
}

console.log(process.argv[2]);

if(process.argv[2]==="--import"){
  importData();
}else if (process.argv[2]==="--delete") {
  deleteData()
}

