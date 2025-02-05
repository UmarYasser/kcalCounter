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
        required:[true,"The Date is Required in the tracker"]
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
            minrange:Number,
            maxrange:Number,
            foods:[{
                "_id":false,
                food:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Food"
                },
                grams:Number,
                foodName:String
            }]
        },
        Lunch:{
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
            minrange:Number,
            maxrange:Number,
            foods:[{
                "_id":false,    
                food:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Food"
                },
                grams:{
                    type:Number
                },
                foodName:String
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
                "_id":false,
                food:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Food"
                },
                grams:Number,
                foodName:String
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
                "_id":false,
                food:{type: mongoose.Schema.Types.ObjectId,
                ref:"Food"
                },
                grams:Number,
                foodName:String
            }]
        },
        
    },    
    exercise:[{
        // calories & carbs & fat added, name of exercise
        "_id":false,
        exer:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Exercise"
        },        
        calories:{
            type:Number,
            default:0
        },
        carb:{
            type:Number,
            default:0
        },
        fat:{
            type:Number,
            default:0
        },
        name:{
            type:String
        },
        duration:{
            type:Number,
            required:[true,"Duration is Required!"],
            default:0
        }
    }]
})

trackerSchema.pre('save',function(next){
    if(this.isNew){
    // make the required macros & cals from diet
    // update diet model to make the macros have a percent and value according to 3 plans [weight loss,maintain,muscle building
    this.required.calories = Math.round(this.diet.dailyIntake)

    this.required.carb = Math.round(this.diet.carbIntake)
    this.required.protien = Math.round(this.diet.protienIntake)
    this.required.fat = Math.round(this.diet.fatIntake)

    } else if(this.isModified('exercise')){
        this.required.calories += Math.round(this.exercise[this.exercise.length-1].calories)
        this.required.carb += Math.round(this.exercise[this.exercise.length-1].carb)
        this.required.fat += Math.round(this.exercise[this.exercise.length-1].fat) 
    }
    this.meals.Breakfast.minrange = (this.required.calories/5).toFixed(0)
    this.meals.Breakfast.maxrange = (this.required.calories/3.333).toFixed(0)
    
    this.meals.Lunch.minrange = (this.required.calories/3.333).toFixed(0)
    this.meals.Lunch.maxrange = (this.required.calories/2.5).toFixed(0)
    
    this.meals.Dinner.minrange = (this.required.calories/3.333).toFixed(0)
    this.meals.Dinner.maxrange = (this.required.calories/2.5).toFixed(0)
    
    this.meals.Snacks.minrange = (this.required.calories/19.93).toFixed(0)
    this.meals.Snacks.maxrange = (this.required.calories/10).toFixed(0)
    
   next()
})


const trackerModel = mongoose.model("Tracker",trackerSchema,"Tracker");

module.exports = trackerModel