const CustomError = require('./../Utils/CustomError');

const devError = (err) =>{
    res.status(err.statusCode).json({
        status:err.statusCode,
        message:err.message,
        stackTrace:err.stack
    })
}

const prodError = (err) =>{
    if(err.isOpretional){
        res.status(err.statusCode).json({
            status:err.statusCode,
            message:err.message,
        })
    }else{
        res.status(err.statusCode).json({
            status:err.statusCode,
            message:"Something is causing an error, please try again later",
        })
    }
}

const asyncErHandler = (func) =>{
    return (req,res,next) =>{
        func(req,res,next).catch(err => next(err));
    }
}

const errorHandler = (err,req,res,next) =>{
    if(process.env.NODE_ENV === 'development')
        devError(err)
    else if(process.env.NODE_ENV === 'production'){

        prodError(err);
    }   
}

module.exports ={errorHandler,asyncErHandler};