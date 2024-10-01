const mongoose = require('mongoose');
const User = require('./../Models/UserModel');


const dietSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        requried:true
    },
    food:{type:mongoose.Schema.Types.ObjectId,ref:"Food"},
    date:{type: Date},
    weight:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum:['male','female']
    },
    meals:[{
        name:String, // Breakfast,Lunch,Dinner
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
    dailyIntake:Number,
    goal:{
        type:String,
        enum:['gain','lose','maintain'],
        default:'maintain'
    },
    daysWorkingOut:{
        type:Number,
        min:0,
        max:7,
        default:0   
    },

})

dietSchema.pre('save',function(next){
    //Calculations done according to input
    if(this.gender === 'male') gen =5
    else if(this.gender === 'female') gen = -161
    this.dailyIntake = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + gen;

    const burnedCal = 4 * this.weight * this.daysWorkingOut;

    if(this.goal === 'gain') this.dailyIntake +=500;
    if(this.goal === 'lose') this.dailyIntake -=500;
    //this.dailyIntake -=burnedCal;
    //--------------

    next()
})

const Diet = new mongoose.model('Diet',dietSchema,'Diet');

module.exports = Diet