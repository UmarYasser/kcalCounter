const Exercise = require('./../Models/ExerciseModel')
const CustomError =require('./../Utils/CustomError');
const Diet = require('./../Models/DietModel');
const {asyncErHandler} = require('./GlobalErrorHandler');
// Comment
let userDiett
// (async function(){
    //     userDiett = userDiet
    // })()

    

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

exports.showAllExercise = asyncErHandler( async(req,res,next) =>{
    const exercises = await Exercise.find()

    res.status(200).json({
        count:exercises.length,
        data:exercises
    })
})

exports.liveSearch = asyncErHandler(async(req,res,next)=>{
    const searchTerm = req.body.searchTerm
    
    if(searchTerm.length ==0){
        res.status(200).json({
            status:"success",
            data:{exerciseNames:[]}
        })
    }else{
        const exercisesFound = await Exercise.find({ name: {$regex:searchTerm,$options: 'i'}},'name')
        res.status(200).json({
            status:"success",
            data:{
                exerciseNames: exercisesFound
            }
        })
    }

})
 

exports.findExercise = asyncErHandler(async(req,res,next)=>{
    const exeName = req.body.searchTerm
    const exercise = await Exercise.findOne({name:{$regex:`^${exeName}$`, $options: 'i'}})
    
    if(!exercise){

        res.status(200).json({
            found:false,
            cals:0
        })
    }
    const userWeight = await Diet.findOne({user:req.user._id},'weight')
    const found = exercise ? true : false
    const cals = exercise.MET * userWeight.weight;
    res.status(200).json({
        status: "success",
        found,
        cals       
    })
})