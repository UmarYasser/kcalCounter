const mongoose = require("mongoose")
const validator = require('validator');

const formSchema = mongoose.Schema({
    name:{
        type:String,
        max:[20, "Name must be less than 20 characters"],
        required:true
    },
    email:{
        type:String,
        required:[true,"Email is requried"],
        validate:{
            validator: function(v){
                return validator.isEmail(v)
            }
        }
        
    }
})

const formModel = mongoose.Model("Form",formSchema,"Form")

module.exports = formModel