const Diet = require('./../Models/DietModel');
const CustomError =require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');
const ApiFeatures = require('./../Utils/ApiFeatures')

exports.setUp= asyncErHandler(async(req,res,next)=>{
    
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
            /*weight:diet.weight,
            height:diet.height,
            age:diet.age,
            gender:diet.gender,
            goal:diet.goal,*/
            dailyIntake:diet.dailyIntake,
            diet
        }
    })
})

exports.updateDiet = asyncErHandler(async(req,res,next)=>{
    const user = req.user;

    const diet = await Diet.find({user:user._id});

    
})