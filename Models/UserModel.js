const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        validate:{
            validator: function(v){
                return  validator.isEmail(v)
            }
        },
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,"Confirm Password is Required"],
        validate:{
            validator: function(v){
                return v === this.password
            }
        },
        message:"The Confirm Password Doesn't match!"
    },
    roles:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },
    diet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Diet'
    },
    photo:String,
    passwordChangedAt:{type: Date, default:1727450553, select:false},
    PWResetToken:String,
    PWResetTokenExpires:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined
    next()
})

userSchema.pre(/^find/,function(next){
    this.find({active:true});
    next();
})

userSchema.methods.comparePassword = async(pass,passDB)=>{
    return  await bcrypt.compare(pass,passDB)
}

userSchema.methods.isPasswordChangedAfIs = async function(JWTTS){
    if(this.passwordChangedAt){
        const psChangeTS = parseInt(this.passwordChangedAt.getTime() /1000,10);
        
        return JWTTS <psChangeTS;
    }
    return false
}

userSchema.methods.RPT = async function(){
    const token = crypto.randomBytes(32).toString('hex')
    this.PWResetToken = crypto.createHash('sha256').update(token).digest('hex');

    this.PWResetTokenExpires = Date.now()+ 10*60*1000
    return token
}

const User = new mongoose.model("User",userSchema,"User");

module.exports = User