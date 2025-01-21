process.on('uncaughtException',(err)=>{
    console.log(err.name,':',err.message);
    console.log("Uncaught Exception, Self Destructing now...");
    //console.log(err.stack)
    process.exit(1);
})

const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STR)
.then(() => console.log('Connection Established with MongoDB Atlas'))
.catch((err)=> console.log('err',err.message));

const PORT = process.env.PORT || 3000

const server = app.listen(PORT,() =>{
    console.log('----------------\nServer Running on Port ',PORT )
})

process.on('unhandledRejection',(err)=>{
    console.log(err.name,':',err.message),
    console.log('Unhandled Rejection, Self Destructing now...');
    server.close(() =>{
        process.exit(1);
    })
})