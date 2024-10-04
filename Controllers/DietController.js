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
            weight:diet[0].weight,
            height:diet[0].height,
            age:diet[0].age,
            gender:diet[0].gender,
            goal:diet[0].goal,
            dailyIntake:diet[0].dailyIntake,
            daysWorkingOut:diet[0].daysWorkingOut, 
            carbIntake:diet[0].carbIntake,      
            protienIntake:diet[0].protienIntake ,          
            fatIntake:diet[0].fatIntake           
        }
    })
})

exports.updateDiet = asyncErHandler(async(req,res,next)=>{
    const user = req.user;

    const diet = await Diet.findOneAndUpdate({user:user._id},req.body,{new:true});

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