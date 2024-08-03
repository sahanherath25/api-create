const fs = require('fs');


const users=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`,"utf-8"));

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

module.exports={
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser
}