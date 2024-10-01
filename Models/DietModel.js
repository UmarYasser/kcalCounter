const mongoose = require('mongoose');

const dietSchema= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    food:{type:mongoose.Schema.Types.ObjectId,ref:"Food"},
    date:{type: Date, required:true},
    meals:[{
        name:String,
        calories:Number,
        macros:{
            carb:Number,
            protien:Number,
            fat:Number
        }
    }],
    range:{
        minRange:Number,
        maxRange:Number
    },
    dailyIntake:Number
})



const Diet = new mongoose.model('Diet',dietSchema,'Diet');

module.exports = Diet