const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authCaptain } = require('../middlewares/auth.middleware');


router.post('/register', [
    body('fullName.firstName').isLength({ min: 2 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body("password").isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Model must be at least 3 characters long'),
    body('vehicle.vehicleType').isIn(['car', 'motocycle', 'auto']).withMessage('Vehicle type must be car, motocycle or auto'),

], captainController.registerCaptain);


router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body("password").isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], captainController.loginCaptain);


router.get('/profile',authCaptain, captainController.getCaptainProfile);

router.get('/logout', authCaptain, captainController.logoutCaptain);
module.exports = router;