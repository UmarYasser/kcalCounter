const fs = require('fs')
const path = require('path')
const authCon = require(path.join(__dirname,'..','Controllers/authController')
const Home = fs.readFileSync(path.join(__dirname,'..','Public/template/Home.html');
const SignUp = fs.readFileSync(path.join(__dirname,'..','Public/template/SignUp.html');
const LogIn = fs.readFileSync(path.join(__dirname,'..', 'Public/template/LogIn.html'))
const SetUp = fs.readFileSync( path.join(__dirname,'..','Public/template/SetUp.html')

const Tracker = fs.readFileSync(path.join(__dirname,'..','Public/template/Tracker.html')
const Activity = fs.readFileSync(path.join(__dirname,'..','Public/template/Activity.html')
const Admin = fs.readFileSync(path.join(__dirname,'..','Public/template/Admin.html')
const notFound = fs.readFileSync(path.join(__dirname,'..','Public/template/404.html')
const forbidden = fs.readFileSync(path.join(__dirname,'..','Public/template/403.html')
const ResetPassword = fs.readFileSync(path.join(__dirname,'..','Public/template/ResetPassword.html')
const Me = fs.readFileSync(path.join(__dirname,'..','Public/template/Me.html')

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
