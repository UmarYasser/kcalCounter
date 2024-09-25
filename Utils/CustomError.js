class CustomError extends Error{
    constructor(msg,statusCode){
        super(msg);
        this.statusCode = this.statusCode || 500;
        this.status = this.status || 'error';
        this.isOpretional = true;

        Error.captureStackTrace(this,this.constructor);
    }

}

module.exports = CustomError