const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');

 
const catchAsync = require('@utils/catchAsync');
const AppError = require('@utils/appError'); 
const encrypt = require('@utils/encrypt'); 

const { User } = require("../models");

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createAndSendToken = (user, statusCode, res) => {
    // sign jwt token
    const token = signToken(user.id);

    const cookieOptions = {
        // from todays dateTime plus the day of expiring, * 24hr * 60min * 60sec * 1000milisec
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: false,
        // set so the cookie cannot be modified anyway by the browser
        httpOnly: true
    }

    // if in prod, send cookie through encrypted connection (https)
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // send the token through cookies
    res.cookie('jwt', token, cookieOptions);

    // remove the user password field on return
    user.password = undefined;

    // resp
    return res.status(statusCode).json({
        status: true,
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {

    const { firstName, lastName, userName, password } = req.body;

    // hash the pasword
    const hasedPassword = await encrypt.encryptPassword(password);

    // create the new user
    const createdUser = await User.create({ 
        firstName,
        lastName,
        userName,
        password: hasedPassword
    });

    createAndSendToken(createdUser, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {
    const { userName, password } = req.body;

    //check if email and password was passed
    if (!userName || !password) {
        return next(new AppError('Please provide email and password.', 400))
    }

    // get user data, also select the password column, use the '+' sign to reselect it, since we have select to false 
    // const user = await User.findOne({ email }).select('+password');
    const user = await User.findOne({ where: { userName } });

    // console.log('user', user);

    //check if user not exist, using the user instance for it model method 
    if (!user || !(await encrypt.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    } 

    // generate token
    createAndSendToken(user, 201, res);
})

exports.protect = catchAsync(async (req, res, next) => {
    // confirm if a token was passed
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    //check if token is empty
    if (!token) {
        return next(new AppError('Please login to get access.', 401));
    }

    //verify the signToken, "buh use the build in promisify util, so we cam use await since the method only returns a callback, so we dont break out structure"
    // jwt.sign(token, process.env.JWT_SECRET);
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exist
    const userData = await User.findByPk(decodedToken.id);
    if (!userData) return next(new AppError('User belonging to this token no longer exist.', 401));
 

    // call the next middleware if all checks are passed
    req.user = userData; // pass the user info, so it can be used in the next miidle ware e.g 'restrictTo'
    next();
})