const express = require('express');
const morgan = require('morgan');  
const xss = require('xss-clean'); 


const AppError = require('@utils/appError'); 
const globalErrorHandler = require('@controllers/errorController');
const userRoute = require('@routes/userRoute');
const postRoute = require('@routes/postRoute');
const commentRoute = require('@routes/commentRoute');


const app = express();

// GLOBAL MIDDLEWARES
 

// developemnt logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into 'req.body'
app.use(express.json({ limit: '10kb' }));


// Data sanitization against Cross Site Scripting Attacks (XSS)
app.use(xss());



// ROUTES
app.use('/api/v1/users', userRoute); 
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comments', commentRoute);




// MIDDLEWARE to check ALL(*) routes that wr not executes above b4 reaching here
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// ERROR MIDDLEWAEW to catch all error
app.use(globalErrorHandler);


module.exports = app;