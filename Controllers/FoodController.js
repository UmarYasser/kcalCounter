const CustomError = require('../Utils/CustomError');
const Food = require('./../Models/FoodModel');
const {asyncErHandler} = require('./GlobalErrorHandler');


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
    const foods = await Food.find();
    if(!foods){
        const err=  new CustomError('No Foods to show...',400)
        return next(err)
    }
    res.status(200).json({
        status:'success',
        count:foods.length,
        data:{
            food:foods
        }
    })
})