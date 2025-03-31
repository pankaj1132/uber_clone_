const express = require('express');
const router = express.Router();
const {body }= require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userModel = require('../models/user.model');
router.post ('/register',[
    body('fullName.firstName').isLength({min:2}).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body("password").isLength({min:6}).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);

router.post('/login',[
    body('email').isEmail().withMessage('Email is not valid'),
    body("password").isLength({min:6}).withMessage('Password must be at least'),
],
    userController.loginUser);  

router.get('/profile', authMiddleware.authUser,userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);











module.exports = router;