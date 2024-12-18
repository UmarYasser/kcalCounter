const router = require('express').Router()
const {asyncErHandler} = require("./GlobalErrorHandler")
const formHandler =  asyncErHandler(async(req ,res ,next)=>{
    const {name,email} = req.body
    
})