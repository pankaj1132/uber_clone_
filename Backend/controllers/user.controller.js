const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blacklistTokenSchema = require('../models/blacklistToken.model');

module.exports.registerUser= async (req,res,next)=>{
 const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    } 
    const {fullName, email, password} = req.body;
    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
       
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword,
    });
    const token = user.generateAuthToken();
    res.status(201).json({user,token});

}


module.exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user) { 
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.matchPasswords(password);
    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({user, token});
}

module.exports.getUserProfile = async(req,res,next)=>{
    const user = await userModel.findById(req.user._id).select('-password');
    if(!user) {
        return res.status(404).json({message: 'User not found'});
    }
    
    res.status(200).json({user});
}
module.exports.logoutUser = async(req,res,next)=>{
    res.cookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const blacklistToken = await blacklistTokenSchema.create({token});
    
    res.status(200).json({message: 'Logged out successfully'});
}