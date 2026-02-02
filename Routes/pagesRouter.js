const fs = require('fs')
const path = require('path')
const authCon = require('./../Controllers/authController')
const Home = fs.readFileSync('./Public/template/Home.html');
const SignUp = fs.readFileSync('./Public/template/SignUp.html');
const LogIn = fs.readFileSync(path.join(__dirname,'Public/template/LogIn.html'))
const SetUp = fs.readFileSync('./Public/template/SetUp.html')

const Tracker = fs.readFileSync('./Public/template/Tracker.html')
const Activity = fs.readFileSync('./Public/template/Activity.html')
const Admin = fs.readFileSync('./Public/template/Admin.html')
const notFound = fs.readFileSync('./Public/template/404.html')
const forbidden = fs.readFileSync('./Public/template/403.html')
const ResetPassword = fs.readFileSync('./Public/template/ResetPassword.html')
const Me = fs.readFileSync('./Public/template/Me.html')

const router = require('express').Router()


router.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    
    res.end(LogIn);   
})
router.get('/SignUp(.html)?',(req,res)=>{
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
    if(req.cookies.jwt == 'loggedout')
        res.end(LogIn)
    res.setHeader('Content-Type','text/html')
    res.end(Tracker)
})
router.route('/Admin(.html)?').get(authCon.protect,(req,res)=>{
    res.setHeader('Content-Type','text/html')
    if(req.user.roles == 'admin')
        res.end(Admin)
    else 
        res.end(forbidden)
})

router.route('/resetPassword(.html)?').get(authCon.protect,(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.end(ResetPassword)
})
router.route('/Activity(.html)?').get(authCon.protect,(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.end(Activity)
})
router.route('/Me(.html)?').get(authCon.protect,(req,res)=>{
    if(req.cookies.jwt == 'loggedout')
        res.end(LogIn)
    res.setHeader('Content-Type','text/html')
    res.end(Me)
})
    


//for not found
router.get('*',(req,res) =>{
    res.setHeader('Content-Type','text/html')
    res.end(notFound)
})

module.exports = router
