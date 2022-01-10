const AppError = require('@utils/appError');


const handleJWTError = () => new AppError('Invalid token, please login again', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired, kindly relogin.', 401);


const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (res, err) => {
    // Operational, truested errors: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Program or other unknown error: don't leak error details
    else {
        // log the error
        console.log('ERROR => ', err);

        // send generic message
        res.status(500).json({
            status: err.status,
            message: 'Opps... Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(res, err);
    } else if (process.env.NODE_ENV === 'production') {
        // destructure the err variable
        let error = { ...err };

        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(res, error);
    }
}