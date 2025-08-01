const express = require('express')
const app = express()
const fs= require('fs');
const foodRouter = require('./Routes/foodRouter');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const trackerRouter = require('./Routes/trackerRouter');
const favoriteRouter = require('./Routes/favoriteRoute');
const exerciseRouter = require('./Routes/exerciseRouter')
const pageRouter = require('./Routes/pagesRouter')
const GlobalErrHandler = require('./Controllers/GlobalErrorHandler')
const xss = require('xss-clean')
const sanitize = require("express-mongo-sanitize")
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const cp = require('cookie-parser')
 
/*app.use(xss)
app.use(sanitize)
*/
let limiter = rateLimit({
    max:1000,
    windowMs: 60*60*1000,
    message:"Too Many Requests, try again later. (after 1h)"
})
app.use(express.json()) 
app.use(helmet())
app.use(express.static('./Public'))
app.use(cp())
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); 

app.use('/api',limiter)
app.use('/api/v1/food',foodRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/tracker',trackerRouter);
app.use('/api/v1/exercise',exerciseRouter);
app.use('/api/v1/favorites',favoriteRouter)
app.use('/',pageRouter)

app.use(GlobalErrHandler.errorHandler)

module.exports = app    
//https://97p7tnf4-3000.uks1.devtunnels.ms/