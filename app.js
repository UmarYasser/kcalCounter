const express = require('express')
const app = express()
const fs= require('fs');
const foodRouter = require('./Routes/foodRouter');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const trackerRouter = require('./Routes/trackerRouter');
const GlobalErrHandler = require('./Controllers/GlobalErrorHandler')
const Home = fs.readFileSync('./public/template/Home.html');
app.use(express.json())

app.use(express.static('./public'))
app.use('/api/v1/food',foodRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/tracker',trackerRouter);

app.use(GlobalErrHandler.errorHandler)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(Home);
})

module.exports = app    