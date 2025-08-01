const Diet = require('./../Models/DietModel');
const Food = require('./../Models/FoodModel');
const User = require("./../Models/UserModel")

const CustomError =require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const ApiFeatures = require('./../Utils/ApiFeatures')

exports.setUp= asyncErHandler(async(req,res,next)=>{
    if(await Diet.findOne({user:req.user._id})){
        res.status(202).json({
            status:'success',
            message:"User already has a diet!"
        })
    }
    
    const profile = await Diet.create({
        user:req.user._id,
        ...req.body
    });
    //Enter: age,weight,height,gender,goal

    res.status(201).json({
        status:'success',
        data:{
            Diet:profile
        }
    })
})

exports.display =asyncErHandler(async(req,res,next)=>{
    
    const user = req.user;

    const features = new ApiFeatures(Diet.find({user:user._id}),req.query)
                        .filter()
                        .sort()
                        .limitFields()
                        .paginate()
    const diet = await features.query

    if(!diet){
        return next(new CustomError('No Diet assigned with this user',400));
    }

    res.status(200).json({
        status:'success',
        data:{
            Name:user.name,
            weight:diet[0].weight,
            height:diet[0].height,
            age:diet[0].age,
            gender:diet[0].gender,
            goal:diet[0].goal,
            dailyIntake:diet[0].dailyIntake,
            daysWorkingOut:diet[0].daysWorkingOut, 
            carbIntake:diet[0].carbIntake,      
            protienIntake:diet[0].protienIntake ,          
            fatIntake:diet[0].fatIntake,
            waterIntake:diet[0].waterIntake         
        }
    })
})

exports.updateDiet = asyncErHandler(async(req,res,next)=>{
    const user = req.user;

    const diet = await Diet.findOneAndUpdate({user:user._id},req.body,{new:true});
    // user.name = req.body.name
    // await user.save()

    if(req.body.name){
        await User.updateOne({_id: user._id}, {$set : {name:req.body.name}})
    }

    if(!diet){
        return next(new CustomError("There is no such user found"),401);
    }    

    await diet.save()
    res.status(200).json({
        status:"success",
        data:{
            diet
        }
    })
})

exports.deleteDiet = asyncErHandler(async(req,res,next)=>{
    const diet = await Diet.findOneAndUpdate({user:req.user._id},{active:false});

    if(!diet){
        return next(new CustomError('There is no such user found',401))
    }

    res.status(204).json({
        status:"success",
        data:null
    })
})

exports.makeFavorite = asyncErHandler(async(req,res,next)=>{
    const foodId = req.body.foodId;
    const diet = await Diet.findOne({user:req.user._id});
    const food = await Food.findById(foodId)
    
    if(!foodId){
        return next(new CustomError("There's no food with this ID"));
    }
 
    diet.favorites.push({food:foodId,foodName:food.name}) 
    await diet.save({new:true})
    res.status(200).json({
        status:"success",
        message:"food pushed successfully",
        favorites:diet.favorites
    })   
})

