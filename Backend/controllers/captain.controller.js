const captainModle = require('../models/captain.model');
const {validationResult} = require('express-validator');
const captainServcie = require('../services/captain.service');
const blacklistTokenSchema = require('../models/blacklistToken.model');


module.exports.registerCaptain = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    } 
 const {fullName, email, password, vehicle} = req.body;
 const isCaptainExist = await captainModle.findOne({email});
 if(isCaptainExist){
        return res.status(422).json({message: 'Captain already exists'});
    }
    if(!vehicle){
        return res.status(422).json({message: 'Please provide vehicle details'});
    }
    const hashPassword = await captainModle.hashPassword(password);
    const captain = await captainServcie.createCaptain({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    });
    const token = captain.generateAuthToken();
    res.status(201).json({captain,token});
}

module.exports.loginCaptain = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    const captain = await captainModle.findOne({email}).select('+password');
    if(!captain) { 
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await captain.matchPasswords(password);
    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({captain, token});
}


module.exports.getCaptainProfile = async(req,res,next)=>{
    const captain = await captainModle.findById(req.captain._id).select('-password');
    if(!captain) {
        return res.status(404).json({message: 'Captain not found'});
    }
    
    res.status(200).json({captain});
}

module.exports.logoutCaptain = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const blacklistToken = await blacklistTokenSchema.create({token});
    res.clearCookie('token');
    
    res.status(200).json({message: 'Logged out successfully'});
}