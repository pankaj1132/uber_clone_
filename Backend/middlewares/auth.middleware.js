const usermodel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const isBlackListed = await usermodel.findOne({token : token});
    if(isBlackListed) return res.status(401).json({ message: 'Unauthorized' });

try 
{
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decode.id);
    req.user = user;
    next();
}
catch (error){
    return res.status(401).json({ message: 'Unauthorized' });
} 
}