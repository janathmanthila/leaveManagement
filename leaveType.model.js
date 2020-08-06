const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leaveType = new Schema({
    leaveType_code:{
        type:String
    },
    leaveType:{
        type: String
    },
    day_type:{
        type: String
    },
    day_range:{
        type: String
    },
    need_supportive:{
        type: Boolean
    },
    need_allocation:{
        type: Boolean
    },
    leaveType_status:{
        type: Boolean
    },
    year_restriction:{
        type: Boolean
    },
},{
    collection: 'leaveType'
});

module.exports = mongoose.model('leaveType', leaveType);