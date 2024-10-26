const Tracker = require('./../Models/trackerModel');
const CustomError = require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const Diet = require('./../Models/DietModel');
const Food = require('./../Models/FoodModel');
const User = require('./../Models/UserModel');
const Exercise = require('./../Models/ExerciseModel')
const ApiFeatures = require('./../Utils/ApiFeatures')

//Has Protect Middleware Before it
exports.eat = asyncErHandler(async(req,res,next)=>{
    const user = req.user;
    let {foodId,foodName} = req.body
    
    if(foodName){   
        const foodArray = await Food.find({name: {$regex: foodName,$options:'i'}});
        if(foodArray.length === 0){
            return next(new CustomError("No Results Found",400));
        }
        res.status(200).json({
            foodArray
        })
    }
    
    if(foodId){
            foodId = await Food.findById(req.body.foodId);

            if(!foodId){
            return next(new CustomError("There's no food with this ID",400));
        }
    }
    if(!req.body.grams){
        return next(new CustomError("Enter the specified number of grams!",400))
    }
    const date = req.body.date;
                                                 // 0123456789
    let parseDate = new Date( // 03-10-2024 XX => 2024-10-03
        date.substring(0,4),
        date.substring(5,7)-1,
        date.substring(8,10),        
    )
    parseDate.toString().split('T')[0]

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
    tracker.eaten.calories += parseFloat((foodId.calories * req.body.grams).toFixed(0))
    tracker.eaten.carb += parseFloat((foodId.carb * req.body.grams).toFixed(1))
    tracker.eaten.protien += parseFloat((foodId.protien * req.body.grams).toFixed(1))
    tracker.eaten.fat += parseFloat((foodId.fat * req.body.grams).toFixed(1))

    tracker.diet.foodName = foodId.name
    if(!req.body.meal){
        return next(new CustomError("Meal is Required",400));
    }
    if(req.body.meal === "Breakfast"){
        tracker.meals.Breakfast.calories += parseInt((foodId.calories * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.carb += parseInt((foodId.carb * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.protien += parseInt((foodId.protien * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.fat += parseInt((foodId.fat * req.body.grams).toFixed(0))

        tracker.meals.Breakfast.foods.push({food:foodId._id,grams:req.body.grams,foodName:foodId.name})        
    }
    if(req.body.meal === "Lunch"){
        tracker.meals.Lunch.calories += (foodId.calories * req.body.grams).toFixed(0)
        tracker.meals.Lunch.carb += (foodId.carb * req.body.grams).toFixed(0)
        tracker.meals.Lunch.protien += (foodId.protien * req.body.grams).toFixed(0)
        tracker.meals.Lunch.fat += (foodId.fat * req.body.grams).toFixed(0);
        tracker.meals.Breakfast.foods.push({food:foodId._id,grams:req.body.grams})
        tracker.meals.Breakfast.foods.push({food:foodId._id,grams:req.body.grams,foodName:foodId.name})
    }
    if(req.body.meal === "Dinner"){
        tracker.meals.Dinner.calories += (foodId.calories * req.body.grams).toFixed(0)
        tracker.meals.Dinner.carb += (foodId.carb * req.body.grams).toFixed(0)
        tracker.meals.Dinner.protien += (foodId.protien * req.body.grams).toFixed(0)
        tracker.meals.Dinner.fat += (foodId.fat * req.body.grams).toFixed(0);
        tracker.meals.Breakfast.foods.push({food:foodId._id,grams:req.body.grams,foodName:foodId.name})
    }
    if(req.body.meal === "Snacks"){
        tracker.meals.Snacks.calories += (foodId.calories * req.body.grams).toFixed(0)
        tracker.meals.Snacks.carb += (foodId.carb * req.body.grams).toFixed(0)
        tracker.meals.Snacks.protien += (foodId.protien * req.body.grams).toFixed(0)
        tracker.meals.Snacks.fat += (foodId.fat * req.body.grams).toFixed(0);
        tracker.meals.Snacks.foods.push({food:foodId._id,grams:req.body.grams,foodName:foodId.name})
    }    

    await tracker.save();

    res.status(201).json({
        status:'success',
        tracker
    })
})

//Has Protect Middleware Before it
exports.exercise = asyncErHandler(async(req,res,next)=>{
    //1.Get the specified tracker
    const user=  await User.findById(req.user._id)
    const date = req.body.date;
                                                 // 0123456789
    let parseDate = new Date( // 03-10-2024 XX => 2024-10-03
        date.substring(0,4),
        date.substring(5,7)-1,
        date.substring(8,10),        
    )
    parseDate.toString().split('T')[0]

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
    //2.Calculate the exercise calories
    const exercised = await Exercise.findById(req.body.exerciseID)
    //tracker.exercise = exercised.MET * req.body.duration * tracker.diet.weight
    // Need Adjusting ***************
    const carbpercent = (tracker.required.carb*4) / (tracker.required.calories)
    const fatpercent = (tracker.required.fat*9) / (tracker.required.calories)
    const burnedCal  = (exercised.MET * req.body.duration * tracker.diet.weight)
    const addedCarb = parseInt(((carbpercent * burnedCal) /4).toFixed(0))
    const addedFat = parseInt(((fatpercent * burnedCal) /9).toFixed(0))
    
    
    const exerciseObj = {
        exer:exercised._id,
        calories:(exercised.MET * req.body.duration * tracker.diet.weight),
        carb: addedCarb,
        fat: addedFat,
        name:exercised.name
    }


    tracker.exercise.push(exerciseObj)
    
    await tracker.save({new:true,runValidators:false})
 
    res.status(200).json({
        status:"success",
        data:{
            added:tracker.exercise,
            required:tracker.required
        }
    })

})


exports.display = asyncErHandler(async(req,res,next)=>{
    const user=  await User.findById(req.user._id)
    const date = req.params.date;
                                                 // 0123456789
    let parseDate = new Date( // 03-10-2024 XX => 2024-10-03
        date.substring(0,4),
        date.substring(5,7)-1,
        date.substring(8,10),        
    )
    parseDate.toString().split('T')[0]

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

    
    if(tracker.eaten.calories === 0){
        console.log("This date is empty, No food recorded today")
    }

    res.status(200).json({
        status:'success',
        data:{
            tracker
        }
    })
})