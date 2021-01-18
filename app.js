const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

// connect to db
const db = require('./config/connection');
db.connectDB();

// start express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers
const userRouter = require('./routes/userRouter');
const imageRouter = require('./routes/imageRouter');

// Use Routers
app.use('/users', userRouter);
app.use('/images', imageRouter);

app.listen(process.env.PORT, () => {
    console.info(`Server is listening on port ${process.env.PORT}`);
});