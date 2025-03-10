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
    let {foodName} = req.body
    let food
    if(foodName){
            food = await Food.findOne({name:foodName});

            if(!food){
            return next(new CustomError("There's no food with this name \nPlease Select from the menu.",400));
        }
    }
    if(!req.body.grams){
        return next(new CustomError("Enter the specified number of grams!",400))
    }
    const date = req.body.date;

    let tracker = await Tracker.findOne({user:user._id,date:date}).populate('diet')
    if(!tracker){
        console.log("Tracker Not found, Creating...")
        const diet = await Diet.findOne({user:user._id});
        if(!diet){
            console.log("Can't found Diet for that user")
            return next(new CustomError("Can't found Diet for that user",400))
        }
        tracker = await Tracker.create({user:user._id,diet:diet,date:date})

        await tracker.populate('diet')
    }
    tracker.eaten.calories += parseFloat((food.calories * req.body.grams).toFixed(0))
    tracker.eaten.carb += parseFloat((food.carb * req.body.grams).toFixed(1))
    tracker.eaten.protien += parseInt((food.protien * req.body.grams).toFixed(1))
    tracker.eaten.fat += parseFloat((food.fat * req.body.grams).toFixed(1))

    tracker.diet.foodName = food.name
    if(!req.body.meal){
        return next(new CustomError("Meal is Required",400));
    }
    if(req.body.meal === "Breakfast"){
        tracker.meals.Breakfast.calories += parseInt((food.calories * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.carb += parseInt((food.carb * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.protien += parseInt((food.protien * req.body.grams).toFixed(0))
        tracker.meals.Breakfast.fat += parseInt((food.fat * req.body.grams).toFixed(0))

        let notFound =true
        tracker.meals.Breakfast.foods.forEach(food =>{
            if(food.foodName == req.body.foodName){
                food.grams += req.body.grams*1
                notFound=false
                return
            }
        })
        if(notFound)
            tracker.meals.Breakfast.foods.push({food:food._id,grams:req.body.grams,foodName:food.name})        
    }
    else if(req.body.meal === "Lunch"){
        tracker.meals.Lunch.calories += parseInt(food.calories * req.body.grams)
        tracker.meals.Lunch.carb += parseInt(food.carb * req.body.grams)
        tracker.meals.Lunch.protien += parseInt(food.protien * req.body.grams)
        tracker.meals.Lunch.fat += parseInt(food.fat * req.body.grams);
        
         let notFound =true
        tracker.meals.Lunch.foods.forEach(food =>{
            if(food.foodName == req.body.foodName){
                food.grams += req.body.grams*1
                notFound=false
                return
            }
        })

        
        if(notFound)
            tracker.meals.Lunch.foods.push({food:food._id,grams:req.body.grams,foodName:food.name})
    }
    else if(req.body.meal === "Dinner"){
        tracker.meals.Dinner.calories += parseInt(food.calories * req.body.grams)
        tracker.meals.Dinner.carb += parseInt(food.carb * req.body.grams)
        tracker.meals.Dinner.protien += parseInt(food.protien * req.body.grams)
        tracker.meals.Dinner.fat += parseInt(food.fat * req.body.grams);

         let notFound =true
        tracker.meals.Dinner.foods.forEach(food =>{
            if(food.foodName == req.body.foodName){
                food.grams += req.body.grams*1
                notFound=false
                return
            }
        })

        
        if(notFound)
            tracker.meals.Dinner.foods.push({food:food._id,grams:req.body.grams,foodName:food.name})
    }
    else if(req.body.meal === "Snacks"){
        tracker.meals.Snacks.calories += parseInt(food.calories * req.body.grams)
        tracker.meals.Snacks.carb += parseInt(food.carb * req.body.grams)
        tracker.meals.Snacks.protien += parseInt(food.protien * req.body.grams)
        tracker.meals.Snacks.fat += parseInt(food.fat * req.body.grams);
       
        let notFound =true
        tracker.meals.Snacks.foods.forEach(food =>{
            if(food.foodName == req.body.foodName){
                food.grams += req.body.grams*1
                notFound=false
                return
            }
        })

        
        if(notFound)
            tracker.meals.Snacks.foods.push({food:food._id,grams:req.body.grams,foodName:food.name})
    } 

    tracker.eaten.carb= Math.round(tracker.eaten.carb)
    tracker.eaten.protien= Math.round(tracker.eaten.protien)
    tracker.eaten.fat= Math.round(tracker.eaten.fat)
    
    await tracker.save();

    res.status(201).json({
        status:'success',
        tracker
    })
})

//Has Protect Middleware Before it
exports.exercise = asyncErHandler(async(req,res,next)=>{
    //1.Get the specified tracker & Body
    const {exerciseName,date} = req.body
    const user=  await User.findById(req.user._id)

    let tracker = await Tracker.findOne({user:user._id,date:date}).populate('diet')

    if(!tracker){
        console.log("Tracker Not found, Creating...")
        const diet = await Diet.findOne({user:user._id});
        if(!diet){
            console.log("Can't found Diet for that user")
            return next(new CustomError("Can't found Diet for that user",400))
        }
        tracker = await Tracker.create({user:user._id,diet:diet,date:date})

        await tracker.populate('diet')
    }
    //2.Calculate the exercise calories
    const exercised = await Exercise.findOne({name:exerciseName})
    if(!exercised)
        return next(new CustomError("No Exercise with that name found, please select from our menu.",404))
    
    // Need Adjusting ***************
    const carbpercent = (tracker.required.carb*4) / (tracker.required.calories)
    const fatpercent = (tracker.required.fat*9) / (tracker.required.calories)
    const burnedCal  = parseInt(exercised.MET * req.body.duration * tracker.diet.weight)
    const addedCarb = parseInt(((carbpercent * burnedCal) /4).toFixed(0))
    const addedFat = parseInt(((fatpercent * burnedCal) /9).toFixed(0))
    

    
    const exerciseObj = {
        name:exercised.name,
        exer:exercised._id,
        calories:(exercised.MET * req.body.duration * tracker.diet.weight),
        carb: addedCarb,
        fat: addedFat,
        duration:(req.body.duration*60)
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

//Has Protect Middleware Before it
exports.display = asyncErHandler(async(req,res,next)=>{
    const user=  await User.findById(req.user._id)
    const date = req.params.date;
  

    let tracker = await Tracker.findOne({user:user._id,date:date}).populate('diet')
    if(!await Tracker.findOne({user:user._id}))
        console.log("TheProblem is in the user")
    if(!await Tracker.findOne({date:date}))
        console.log("TheProblem is in the date")

    if(!tracker){
        console.log("Tracker Not found, Creating...")
        const diet = await Diet.findOne({user:user._id});

        if(!diet){
            console.log("Can't found Diet for that user")
            console.log("Will Be Fixed Soon....")            
        }
        tracker = await Tracker.create({user:user._id,diet:diet,date:date})
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