const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'User Must Enter Name'],
      maxlength: [20, 'Name Must have less than or equal 20 Characters'],
      minlength: [8, 'Name should have least 8 Characters in the Name'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Please Enter Valid Email']
    },
    photo: {
      type: String,
      default: ''
    },
    role:{
      type:String,
      enum:['user', 'guide', 'lead-guide', 'admin'],
      default:"user"
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Password is required'],
      select: false
    },
    passwordConfirm: {
      type: String,
      minlength: 8,
      required: [true, 'Password is required'],
      validate: {
        //TODO Here this function will be called when document is create() or save()  before save
        //TODO Need To return true or false
        // TODO save() ==>When Updating
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: {
      type: Date
    },
    PasswordResetToken:String,
    PasswordResetExpires:Date
  }
);

//TODO Creating a pre save ()


userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  //TODO  After document created we dont want confirmPassword filed to be saved
  // After matching the password

  // Verify the role before saving
  console.log('Role before saving:', this.role);

  // so we set undefined before saved in the database
  this.passwordConfirm = undefined;
  next();

});


userSchema.pre("save",function(next){
//  We need to execute this only modify the password
  if(!this.isModified("password")|| this.isNew) return next();
  this.passwordChangedAt=Date.now()-1000
  next()
})

//TODO Encrypting the provided Password

//TODO Creating Instance Method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
//  Only return true or false
  let result = await bcrypt.compare(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  //THis field is added if PWD is changed
  if (this.passwordChangedAt) {
    // let changedTimestamp=this.passwordChangedAt.getTime()
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    console.log('Password Changed ', changedTimestamp, JWTTimestamp);
    //  Check if PWD is changed
    //  Token issue 100
    //  PWD changed at 200
    //           100     < 200
    return JWTTimestamp < changedTimestamp;
  }

  //false means PWD is not changed
  return false;
};


userSchema.methods.createPasswordResetToken=function() {
  //Getting a token
  const resetToken=crypto.randomBytes(32).toString("hex");

  //TODO Save the token
  this.PasswordResetToken=crypto.createHash("Sha256").update(resetToken).digest("hex")

//  TODO Set timer to expire token
//  TODO 10 mins convert to  mili seconds

  this.PasswordResetExpires=Date.now()+10*60*1000;

  return resetToken
}

//TODO Creating User Model For Schema
const User = mongoose.model('User', userSchema);
//
// module.exports={
//   User:User
// }

module.exports = User;
