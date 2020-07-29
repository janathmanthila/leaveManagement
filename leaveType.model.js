const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leaveType = new Schema({
    leaveType_code:{
        type:String
    },
    leaveType:{
        type: String
    },
    leaveType_status:{
        type: Boolean
    },
},{
    collection: 'leaveType'
});

module.exports = mongoose.model('leaveType', leaveType);