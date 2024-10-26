const Exercise = require('./../Models/ExerciseModel')
const CustomError =require('./../Utils/CustomError');
const {asyncErHandler} = require('./GlobalErrorHandler');

exports.addExercise = asyncErHandler(async(req,res,next)=>{
    const {name,MET} = req.body
    const exercise = await Exercise.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
            exercise
        }
    })

})