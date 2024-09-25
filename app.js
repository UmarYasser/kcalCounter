const express = require('express')
const app = express()
const fs= require('fs');
const foodRouter = require('./Routes/foodRouter');

const Home = fs.readFileSync('./public/template/Home.html');
app.use(express.json())
app.use('/api/v1/food',foodRouter)
app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(Home);
})

module.exports = app 