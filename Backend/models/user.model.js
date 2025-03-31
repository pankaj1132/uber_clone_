const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName :{
        firstName :{
            type : String,
            required : true,
            minlength : [3, 'First name must be at least 3 characters long']
        },
        lastName :{
            type : String,
            minlength : [3, 'First name must be at least 3 characters long']
        }
    },
    email:{
        type : String,
        required : true,
        unique : true,
        match : [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    password :{
        type : String,
        required : true,
        select: false,
       
    },

    socketId :{
        type : String,
        
    },
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({id : this._id}, process.env.JWT_SECRET ,{
      expiresIn : '1d'});
    return token;
}

userSchema.methods.matchPasswords = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}  
module.exports = mongoose.model('user', userSchema);