const mongoose = require('mongoose');


const trackerSchema = new mongoose.Schema({
    diet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Diet'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date:{
        type:Date,
        required:[true,"The Date is Required in the tracker"],
        unique:true
    },
    eaten:
        {
            calories:{
                type:Number,
                default:0
            },
            carb:{
                type:Number,
                default:0
            },
            protien:{
                type:Number,
                default:0
            },
            fat:{
                type:Number,
                default:0
            },
        },
    required:
        {
            calories:{
                type:Number,
                default:0
            },
            carb:{
                type:Number,
                default:0
            },
            protien:{
                type:Number,
                default:0
            },
            fat:{
                type:Number,
                default:0
            },
    },
    meals:{
        Breakfast:{
                calories:{type:Number,
                default:0
            },
            carb:{
                type:Number,
                default:0
            },
            protien:{
                type:Number,
                default:0
            },
            fat:{
                type:Number,
                default:0
            },
            minrange:Number,
            maxrange:Number,
            foods:[{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Food"
            }]
        },
        Lunch:{
            calories:{type:Number,
            default:0
            },
            carb:{type:Number,
            default:0
            },
            protien:{type:Number,
            default:0
            },
            fat:{type:Number,
            default:0
            },
            minrange:Number,
            maxrange:Number,
            foods:[{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Food"
            }]
        },
        Dinner:{
            calories:{type:Number,
            default:0
            },
            carb:{type:Number,
            default:0
            },
            protien:{type:Number,
            default:0
            },
            fat:{
                type:Number,
                default:0
            },
            minrange:Number,
            maxrange:Number,
            foods:[{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Food"
            }]
        },
        Snacks:{
            calories:{type:Number,
            default:0
            },
            carb:{type:Number,
            default:0
            },
            protien:{type:Number,
            default:0
            },
            fat:{type:Number,
            default:0
            },
            minrange:Number,
            maxrange:Number,
            foods:[{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Food"
            }]
        },
        
    }    
    
})

trackerSchema.pre('save',function(next){
    // make the required macros & cals from diet
    // update diet model to make the macros have a percent and value according to 3 plans [weight loss,maintain,muscle building
    this.required.calories = this.diet.dailyIntake
    this.required.carb = this.diet.carbIntake
    this.required.protien = this.diet.protienIntake
    this.required.fat = this.diet.fatIntake

    this.meals.Breakfast.minrange = (this.diet.dailyIntake/5).toFixed(0)
    this.meals.Breakfast.maxrange = (this.diet.dailyIntake/3.333).toFixed(0)
    
    this.meals.Lunch.minrange = (this.diet.dailyIntake/3.333).toFixed(0)
    this.meals.Lunch.maxrange = (this.diet.dailyIntake/2.5).toFixed(0)
    
    this.meals.Dinner.minrange = (this.diet.dailyIntake/3.333).toFixed(0)
    this.meals.Dinner.maxrange = (this.diet.dailyIntake/2.5).toFixed(0)
    
    this.meals.Snacks.minrange = (this.diet.dailyIntake/19.93).toFixed(0)
    this.meals.Snacks.maxrange = (this.diet.dailyIntake/10).toFixed(0)

    next()
})

const trackerModel = mongoose.model("Tracker",trackerSchema,"Tracker");

module.exports = trackerModel