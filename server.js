const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STR)
.then(() => console.log('Connection Established with MongoDB Atlas'))
.catch((err)=> console.log('err',err.message));

const PORT = process.env.PORT

const server = app.listen(PORT,() =>{
    console.log('----------------\nServer Running on Port ',PORT )
})