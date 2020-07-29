const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');


let CalendarEvent = new Schema({
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
    },
    title:{
        type:String
    },
    employeeName:{
        type:String
    },
    leaveTypeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'leaveType',
    },
    leaveAmount:{
        type:Number
    },
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    },
    manager:{
        type: String
    },
    reason:{
        type: String
    },
    status:{
        type: String
    },
    color:{
        type: String
    },
    email:{
        type: String
    },
    managerEmail: {
        type: String
    },
    reject_reason: {
        type: String
    },
    supportiveEmployeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
    },

},{
    collection: 'CalendarEvent'
});

module.exports = mongoose.model('CalendarEvent', CalendarEvent);