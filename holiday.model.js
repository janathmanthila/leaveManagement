const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

let Holiday = new Schema({
    holidayId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Holiday',
    },
    holidayName:{
        type:String,
    },
    holidayDescription:{
        type:String,
    },
    holidayType:{
        type: String,
    },
    startDate:{
        type: String,
    },
    endDate:{
        type: String,
    }
},{
    collection: 'Holiday'
});

module.exports = mongoose.model('Holiday', Holiday);