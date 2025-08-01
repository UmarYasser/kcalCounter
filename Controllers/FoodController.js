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


// From Frontend
exports.liveSearch = asyncErHandler( async(req,res,next)=>{
    const searchQ = req.body.searchTerm.toLowerCase();
    
    if(searchQ.length <1){
        res.json({status:'success', data:{foods:[]}})
    }else{
        const foodsFound = await Food.find({ name: { $regex: searchQ, $options: 'i' } })
        
        res.status(200).json({
            status: 'success',
            data: {
                foodObject: foodsFound
            }
        })
    }
})

exports.findFood = asyncErHandler(async(req,res,next)=>{ // req.body.foodName
    const foodN = req.body.foodName
    const food = await Food.findOne({name:foodN})
    const found = food ? true : false
    res.json({
        found,

    })
})