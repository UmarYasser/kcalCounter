const express = require('express')
const app = express()
const fs= require('fs');
const foodRouter = require('./Routes/foodRouter');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const trackerRouter = require('./Routes/trackerRouter');
const favoriteRouter = require('./Routes/favoriteRoute');
const exerciseRouter = require('./Routes/exerciseRouter')
const GlobalErrHandler = require('./Controllers/GlobalErrorHandler')
const Home = fs.readFileSync('./public/template/Home.html');
const index = fs.readFileSync('./public/template/index.html');
const xss = require('xss-clean')
const sanitize = require("express-mongo-sanitize")
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const cp = require('cookie-parser')

/*app.use(xss)
app.use(sanitize)
*/
app.use(express.json()) 
app.use(helmet())
app.use(express.static('./public'))
app.use(cp())
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/food',foodRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/tracker',trackerRouter);
app.use('/api/v1/exercise',exerciseRouter);
app.use('/api/v1/favorites',favoriteRouter)

app.use(GlobalErrHandler.errorHandler)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    //res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade'); 
    res.end(index);
})

module.exports = app    