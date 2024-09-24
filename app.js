const express = require('express')
const app = express()
const fs= require('fs');

const Home = fs.readFileSync('./public/template/Home.html');


app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(Home);
})

module.exports = app