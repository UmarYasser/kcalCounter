const mongoose = require('mongoose');
const Tracker = require('./../Models/trackerModel');
const CustomError = require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const Diet = require('./../Models/DietModel');
const Food = require('./../Models/FoodModel');
const User = require('../Models/UserModel');

//Has Protect Middleware Before it
exports.eat = asyncErHandler(async(req,res,next)=>{
    const user = req.user;
    const food = await Food.findById(req.body.foodId);
    if(!food){
        return next(new CustomError("There's no food with this ID",400));
    }
    const date = req.body.date;
                                // 0123456789
    const parseDate = new Date( // 03-10-2024
        date.substring(4,8),
        date.substring(2,4)-1,
        date.substring(0,2),        
    )

    let tracker = await Tracker.findOne({user:user._id,date:parseDate}).populate('diet')
    if(!tracker){
        console.log("Tracker Not found, Creating...")
        const diet = await Diet.findOne({user:user._id});
        if(!diet){
            console.log("Can't found Diet for that user")
            return next(new CustomError("Can't found Diet for that user",400))
        }
        tracker = await Tracker.create({user:user._id,diet:diet,date:parseDate})

        await tracker.populate('diet')
    }
    tracker.eaten.calories += (food.calories * req.body.grams)
    tracker.eaten.carb += food.carb * req.body.grams
    tracker.eaten.protien += food.protien * req.body.grams
    tracker.eaten.fat += food.fat * req.body.grams
    tracker.diet.foodName = food.name
    if(!req.body.meal){
        return next(new CustomError("Meal is Required",400));
    }
    if(req.body.meal === "Breakfast"){
        tracker.meals.Breakfast.calories += (food.calories * req.body.grams)
        tracker.meals.Breakfast.carb += (food.carb * req.body.grams)
        tracker.meals.Breakfast.protien += (food.protien * req.body.grams)
        tracker.meals.Breakfast.fat += (food.fat * req.body.grams);
        tracker.meals.Breakfast.foods.push(food._id)
    }
    if(req.body.meal === "Lunch"){
        tracker.meals.Lunch.calories += (food.calories * req.body.grams)
        tracker.meals.Lunch.carb += (food.carb * req.body.grams)
        tracker.meals.Lunch.protien += (food.protien * req.body.grams)
        tracker.meals.Lunch.fat += (food.fat * req.body.grams);
        tracker.meals.Lunch.foods.push(food._id)
    }
    if(req.body.meal === "Dinner"){
        tracker.meals.Dinner.calories += (food.calories * req.body.grams)
        tracker.meals.Dinner.carb += (food.carb * req.body.grams)
        tracker.meals.Dinner.protien += (food.protien * req.body.grams)
        tracker.meals.Dinner.fat += (food.fat * req.body.grams);
        tracker.meals.Dinner.foods.push(food._id)
    }
    if(req.body.meal === "Snacks"){
        tracker.meals.Snacks.calories += (food.calories * req.body.grams)
        tracker.meals.Snacks.carb += (food.carb * req.body.grams)
        tracker.meals.Snacks.protien += (food.protien * req.body.grams)
        tracker.meals.Snacks.fat += (food.fat * req.body.grams);
        tracker.meals.Snacks.foods.push(food._id)
    }

    

    

    await tracker.save();

    res.status(201).json({
        status:'success',
        tracker
    })
})

exports.display = asyncErHandler(async(req,res,next)=>{
    const user = await User.findOne({_id:req.user._id})
    if(!user){
        console.error('That User was not found!');
    }

    const tracker = await Tracker.findOne({user:user._id});
    if(!tracker){
        return next(new CustomError("There No Tracker for that user  yet,Please go and setup one",400));
    }

    res.status(200).json({
        status:'success',
        data:{
            tracker,
            diet:tracker.diet,
        }
    })
})