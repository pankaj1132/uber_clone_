const captainModel = require('../models/captain.model');

module.exports.createCaptain=async ({
    firstName,
    lastName,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType
})=>{
    if(!firstName || !lastName || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error('Please provide all required fields');
    }
    const captain = await captainModel.create({
        fullName:{
            firstName,
            lastName,
      },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        }
    });
    return captain;
}