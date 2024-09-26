const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


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
    photo:String,
    passwordChangedAt:Date,
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined
    next()
})

userSchema.methods.comparePassword = async(pass,passDB)=>{
    return  await bcrypt.compare(pass,passDB)
}

userSchema.methods.isPasswordChangedAfIs = async function(JWTTS){
    if(this.passwordChangedAt){
        const psChangeTS = parseInt(this.passwordChangedAt.getTime());
        return JWTTS <psChangeTS;
    }
    next()
}

const User = new mongoose.model("User",userSchema,"User");




module.exports = User