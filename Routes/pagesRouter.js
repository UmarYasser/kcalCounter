const fs = require('fs')
const Home = fs.readFileSync('./public/template/Home.html');
const SignUp = fs.readFileSync('./public/template/SignUp.html');
const LogIn = fs.readFileSync('./public/template/LogIn.html');
const SetUp = fs.readFileSync('./public/template/SetUp.html')
const Tracker = fs.readFileSync('./public/template/Tracker.html')
const Admin = fs.readFileSync('./public/template/Admin.html')
const notFound = fs.readFileSync('./public/template/404.html')
const authCon = require('./../Controllers/authController')

const router = require('express').Router()

router.get('/(SignUp(.html)?)?',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(SignUp);
    
})
router.get('/LogIn(.html)?',(req,res)=>{
    res.setHeader('Content-Type','text/html');  
    res.end(LogIn);
})
router.get('/SetUp(.html)?',(req,res)=>{
    res.setHeader('Content-type','text/html')
    res.end(SetUp)
})
router.get('/Tracker(.html)?',(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.end(Tracker)
})
router.route('/Admin(.html)?').get(authCon.protect,authCon.strict('admin'),(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.end(Admin)
})
    


//for not found
router.get('*',(req,res) =>{
    res.setHeader('Content-Type','text/html')
    res.end(notFound)
})

module.exports = router