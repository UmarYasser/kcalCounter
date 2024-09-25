const Food = require('./../Models/FoodModel');
const {asyncErHandler} = require('./GlobalErrorHandler');


exports.addFood = asyncErHandler( async(req,res)=>{
    const food = await Food.create(req.body);
    
    res.status(201).json({
        status:'success',
        data:{
            food
        }
    })
})