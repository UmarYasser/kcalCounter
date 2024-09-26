const User = require("./../Models/UserModel");
const CustomError = require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const jwt = require('jsonwebtoken')
const util = require('util');

const signToken = (id) =>{
    return jwt.sign({id:id},process.env.SECRET_STR)
}

exports.signUp = asyncErHandler(async(req,res,next)=>{
    const user = await User.create(req.body);

    const token = signToken(user._id)
    res.status(201).json({
        status:'success',
        token,
        data:{
            user
        }
    })
})

exports.logIn = asyncErHandler(async(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        const err = new CustomError('Email & Password Are Required',400);
        return next(err)
    }
    const user = await User.findOne({email:req.body.email});
    
    if(!user){
        const err = new CustomError('No User with that email was found',401);
        return next(err);
    }

    const isMatch = await user.comparePassword(req.body.password,user.password)

    if(!isMatch){
        const err = new CustomError("Incorrect Password",401)
    }

    const loginToken = signToken(user._id)

    res.status(200).json({
        status:'success',
        token:loginToken,
        user
    })
})

exports.protect = asyncErHandler(async(req,res,next) =>{ //req.headers.authorization = bearer token
    //1
    const testToken = req.headers.authorization.split(' ');
    console.log('testToken:', testToken);
    if(!testToken || !testToken[0] === 'bearer'){
        const err = new CustomError('Enter a Valid Token in the Request Headers',400)
        return next(err)
    }
    let token = testToken[1];
    console.log('token:', token)
    //2
    const decoded = await util.promisify(jwt.verify)(token,process.env.SECRET_STR); // return user._id, issued at (iat)
    console.log(decoded)
    const user = await User.findById(decoded.id);

    if(!user)
        return next(new CustomError("That User doesn't exist",401))
    //3
   /* if(user.isPasswordChangedAfIs(decoded.iat)){
        return next(new CustomError('Session Expired, Login again',401))
    }*/ 
    //4
    req.user = user;
    next()
})

exports.strict = (...role) =>{
    return function(req,res,next){
        if(!role.includes(req.user.role)){
            return next(new CustomError("You Don't have the permission to perform this action.",403));
        }
        next();
    }
}
