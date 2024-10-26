const mongoose = require('mongoose');
const User = require('./../Models/UserModel');


const dietSchema= new mongoose.Schema({
    food:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Food"
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        requried:true
    },
    date:Date,
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
    range:{
        minRange:Number,
        maxRange:Number
    },
    dailyIntake:{
        type:Number,
        default:0
    },
    carbIntake:{
        type:Number,
    },
    protienIntake:{
        type:Number,
    },
    fatIntake:{
        type:Number,
    },
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
    active:{
        type:Boolean,
        default:true
    },
    favorites:[{
        "_id":false,
        food:{

            type:mongoose.Schema.Types.ObjectId,
            ref:"Food"
        },
        foodName:String
    }],
    foodName:String 
})

dietSchema.pre('save',function(next){
    //Calculations done according to input
    if(this.gender === 'male') gen =5
    else if(this.gender === 'female') gen = -161

    //for Basic Metabolic Rate (BMR)
    this.dailyIntake = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + gen;

    //Phyiscal Activity
    switch(this.daysWorkingOut){
        case 0:
            this.dailyIntake*=1.2;
            break;
        case 1 || 2 :
            this.dailyIntake*=1.375;
            break;
        case 3 || 4 :
            this.dailyIntake*=1.55;
            break;
        case 5:
            this.dailyIntake*=1.73;
            break;
        case 6||7:
            this.dailyIntake*=1.9;
            break; 
        default: this.dailyIntake*=1.2
            break;
    }

    if(this.goal === 'gain') this.dailyIntake +=500;
    if(this.goal === 'lose') this.dailyIntake -=500;
    //--------------
    if(this.goal === "lose"){
        this.carbIntake = this.dailyIntake*0.35 /4
        this.protienIntake = this.dailyIntake*0.35 /4
        this.fatIntake = this.dailyIntake*0.30 /9
    } else if(this.goal === "maintain"){
        this.carbIntake = this.dailyIntake*0.45 /4
        this.protienIntake = this.dailyIntake*0.25 /4
        this.fatIntake = this.dailyIntake*0.30 /9
    } else if(this.goal === "gain"){
        this.carbIntake = this.dailyIntake*0.50 /4
        this.protienIntake = this.dailyIntake*0.30 /4
        this.fatIntake = this.dailyIntake*0.20 /9
    }
    this.carbIntake = this.carbIntake.toFixed(1)
    this.protienIntake = this.protienIntake.toFixed(1)
    this.fatIntake = this.fatIntake.toFixed(1)
    next()
})

const Diet =  mongoose.model('Diet',dietSchema,'Diet');

module.exports = Diet