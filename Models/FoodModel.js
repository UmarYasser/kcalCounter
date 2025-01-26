const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is Required'],
        trim:true,
        minlength:[4,'Food Name must be between 4 & 25'],
        maxlength:[25,'Food Name must be between 4 & 25']
    },
    calories:{
        type:Number,
        required:[true,'All Macros are required'],
    },
    carb:{
        type:Number,
        required:[true,'All Macros are required'],
    },
    protien:{
        type:Number,
        required:[true,'All Macros are required'],
    },
    fat:{
        type:Number,
        required:[true,'All Macros are required'],
    },
    processed:{
        type:Boolean,
        default:false
    },
    calorieDense:{
        type:Boolean,
        default:false
    },
    highSugar:{
        type:Boolean,
        default:false
    }
})

foodSchema.pre('save',function(next){
    if(this.calories >=3){
        this.calorieDense =true;
    }
    if(this.carb <=1){
        this.carb = this.carb*100 + '%'
    }
    
    next();
})
const Food = mongoose.model('Food',foodSchema,'Food');


module.exports = Food;