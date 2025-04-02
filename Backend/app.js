const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDB = require('./db/db');
const cookiesParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
connectToDB();

app.use(cors());
app.use(cookiesParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/users', userRoutes);
app.use('/captains' , captainRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});


module.exports = app;