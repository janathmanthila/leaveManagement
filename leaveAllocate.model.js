const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LeaveAllocate = new Schema({
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
    },
    year:{
        type: Number
    },
    leaveTypeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'leaveType',
    },
    leaveAmount:{
        type: Number
    },
    leaveAllocate_status:{
        type: Boolean
    },
},{
    collection: 'leaveAllocate'
});

module.exports = mongoose.model('LeaveAllocate', LeaveAllocate);