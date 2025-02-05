class CustomError extends Error{
    constructor(msg,statusCode){
        super(msg);
        this.statusCode = statusCode ;
        this.status = statusCode >= 400 && statusCode <500 ? 'fail' : 'error';
        this.isOpretional = true;

        Error.captureStackTrace(this,this.constructor);
    }

} // return next(new CustomError('User not found',404))
module.exports = CustomError