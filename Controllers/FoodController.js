const CustomError = require('../Utils/CustomError');
const Food = require('./../Models/FoodModel');
const {asyncErHandler} = require('./GlobalErrorHandler');
const apiFeatures = require('./../Utils/ApiFeatures');

exports.addFood = asyncErHandler( async(req,res,next)=>{
    const food = await Food.create(req.body);
    
    res.status(201).json({
        status:'success',
        data:{
            food
        }
    })
})


exports.getAllFood = asyncErHandler(async(req,res,next)=>{

     const features = new apiFeatures(Food.find(),req.query)
                        .filter()
                        .sort()
                        .limitFields()
                        .paginate()
    let foods = await features.query;

    if(!foods){
        const err=  new CustomError('No Foods to show...',400)
        return next(err)
    }

    /** const features = new ApiFeatures(Movie.find(), req.query)
                            .filter()
                            .sort()
                            .limitFields()
                            .paginate();
    let movies = await features.query; */
    res.status(200).json({
        status:'success',
        count:foods.length,
        data:{
            food:foods
        }
    })
})

exports.editFood = asyncErHandler(async(req,res,next)=>{
  const food = await Food.findByIdAndUpdate(req.params.id,req.body,{new:true});
  await food.save();
  res.status(200).json({
    status:"success",
    data:{food}
  })

})

exports.deleteFood = asyncErHandler(async(req,res,next)=>{
    const foodId = await Food.findByIdAndDelete(req.params.id)
    if(!foodId) 
        return next(new CustomError("No Food Found",401))

    res.status(200).json({
        status:"success",
        data: null
    })

})