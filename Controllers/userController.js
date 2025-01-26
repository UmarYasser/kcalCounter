const CustomError = require('../Utils/CustomError');
const User = require('./../Models/UserModel');
const { asyncErHandler } = require('./GlobalErrorHandler');
const jwt = require('jsonwebtoken')
const Api = require('./../Utils/ApiFeatures')

const signToken = (id) =>{
    return jwt.sign({id:id},process.env.SECRET_STR,{expiresIn:process.env.EXPIRES_IN})
}

const filterReq = (reqBody,...allowedF)=>{
    const newObj = {};
    Object.keys(reqBody).forEach(prop =>{
        if(allowedF.includes(prop)){
            newObj[prop] = reqBody[prop]
        }
    })
    return newObj;
}

//Has PRotect MW Before it
exports.updatePassword = asyncErHandler(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        return next(new CustomError("This User isn't found at the moment",401))
    }

    if(!(await user.comparePassword(req.body.oldPassword,user.password))){
        return next(new CustomError('Old Password is wrong...',401))
    }
    else{
        user.password = req.body.newPassword
        user.confrimpassword = req.body.confirmPassword
        await user.save();
    }   
    const token = signToken(user._id);

    res.status(200).json({
        status:'success',
        message:'Password Changed Successfully',
        token
    })
})

//Has PRotect MW Before it

exports.updateMe = asyncErHandler( async(req,res,next)=>{
    if(req.body.password || req.body.confrimpassword){
        return next(new CustomError("You can't update password from this endpoint",400));
    }
    if(req.body.passwordChangedAt || req.body.PWResetTokenExpires || req.body.PWResetToken)
        return next(new CustomError("You can't touch these info...",403))
    
    const allowedFields = ['name','email','photo'];
    const filterObj = filterReq(req.body,...allowedFields);

    const user = await User.findByIdAndUpdate(req.user._id,filterObj,{runValidators:true,new:true})
    if(!user){
        return next(new CustomError("This User isn't found",401));
    }
   // await user.save({validatorsBeforeSave:false})
    res.status(200).json({
        status:"success",
        message:"User Details Updated",
        user
    })

})

//Has PRotect MW Before it
exports.deleteMe = asyncErHandler( async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(204).json({
        status:'success',
        data:user
    })
})

exports.showAllUsers = asyncErHandler(async(req,res,next) =>{
    const features = new Api(User.find({active:true}),req.query).sort().paginate().filter().limitFields()
    const users = await features.query
    if(!users){
        return next(CustomError("No Users are in the database",404))
    }
    res.status(200).json({
        status:'success',
        count:users.length,
        users
    })
})