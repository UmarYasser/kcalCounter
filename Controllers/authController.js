const User = require("./../Models/UserModel");
const CustomError = require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const jwt = require('jsonwebtoken')
const util = require('util');
const Email = require('./../Utils/Email');
const crypto = require('crypto')

const signToken = (id) =>{
    return jwt.sign({id:id},process.env.SECRET_STR)
}


exports.signUp = asyncErHandler(async(req,res,next)=>{
    const user = await User.create(req.body);

    const token = signToken(user._id)

    options= {
        httpOnly:true,
        maxAge:process.env.EXPIRES_IN
    }

    data = user
    if(process.env.NODE_ENV == 'production')
        data = null
        options.secure = true


    res.cookie('jwt',token,options)
    res.status(201).json({
        status:'success',
        token,
        data
    })
    
})

exports.logIn = asyncErHandler(async(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        const err = new CustomError('Email & Password Are Required',400);
        return next(err)
    }
    const user = await User.findOne({email:req.body.email}).select("+password");
    
    if(!user){
        const err = new CustomError('No User with that email was found',401);
        return next(err);
    }

    const isMatch = await user.comparePassword(req.body.password,user.password)

    if(!isMatch){
        const err = new CustomError("Incorrect Password",401)
    }

    const loginToken = signToken(user._id)

    options = {
        httpOnly:true,
        maxAge:process.env.EXPIRES_IN
    }

    if(process.env.NODE_ENV === 'production')
        options.secure = true
    res.cookie('jwt',loginToken, options)
    res.status(200).json({
        status:'success',
        token:loginToken,
    })
})

exports.protect = asyncErHandler(async(req,res,next) =>{ //req.headers.authorization = bearer token
    //1
    // const testToken = req.headers.authorization.split(' ');
    
    // if(!testToken || !testToken[0] === 'bearer'){
    //     const err = new CustomError('Enter a Valid Token in the Request Headers',400)
    //     return next(err)
    // }

    let token = req.cookies.jwt || testToken[1] ;
    
    //2
    const decoded = await util.promisify(jwt.verify)(token,process.env.SECRET_STR); // return user._id, issued at (iat)
  
    const user = await User.findById(decoded.id);

    if(!user)
        return next(new CustomError("That User doesn't exist",401))
    //3
    if(await user.isPasswordChangedAfIs(decoded.iat)){
        return next(new CustomError('Session Expired, Login again',401))
    } 
    //4
    req.user = user;
    next()
})

exports.strict = (...role) =>{
    return function(req,res,next){
        if(!role.includes(req.user.roles)){
            return next(new CustomError("You Don't have the permission to perform this action.",403));
        }
        next();
    }
}

exports.forgotPassword = asyncErHandler(async(req,res,next) =>{
    //1. Identify the user with the given email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        const err = new CustomError('Email Not Found!',401);
        return next(err);
    }

    //2.Make a token and save it encrypted in the db
    const token = await user.RPT() 
    await user.save({validatorsBeforeSave:false}) 

    const devUrl ='legendary-tribble-97j6pwxvx9vpcx6r.github.dev';
    const resetUrl = `https://${devUrl}/api/v1/auth/resetPassword/${token}`;

    const message = `We have recieved a request to reset your password\n\nFollow this link\n${resetUrl}\n\nThis link in only valid for 10 mins`;
    //3.send it the user's gmail
    try{
        await Email.sendEmail({
            email:user.email,
            message:message,
            subject:'Reset Password'
        })
        res.status(200).json({
            status:'success',
            message:'Password Reset Link Sent'
        })
    }catch(err){
        user.PWResetToken = undefined;
        user.PWResetTokenExpires = undefined;
        await user.save({validatorsBeforeSave:false});

        return next( new CustomError("Couldn't send Email",err.message,405))
    }
})

exports.resetPassword = asyncErHandler(async(req,res,next)=>{
    //encrypt the token passed in the queryString just like the token stored in the db to be compared with it 
    const token = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({PWResetToken:token,PWResetTokenExpires:{$gt:Date.now()}});

    if(!user){
        return next(new CustomError('Invalid Token',400));
    }

    
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.PWResetToken = undefined
    user.PWResetTokenExpires = undefined
    user.passwordChangedAt = Date.now();

    await user.save();
    const logInToken = signToken(user._id);

    res.status(200).json({
        status:'success',
        message:"Password Reset Done",
        
        token:logInToken
    })

})

// exports.authCookie = asyncErHandler(async(req,res,next)=>{
//     const token = req.cookies.jwt
//     const decoded = await util.promisify(jwt.verify)(token,process.env.SECRET_STR)

//     req.user._id
// }