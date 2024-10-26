const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        minlength:[3,"Exercise Name must be between 3 and 20."],
        maxlength:[20,"Exercise Name must be between 3 and 20."]
    },
    MET:{
        type:Number,
        required:true
    }
})


const exerciseModel = mongoose.model("Exercise",exerciseSchema,"Exercise");

module.exports = exerciseModel