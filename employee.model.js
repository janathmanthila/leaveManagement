const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

let Employee = new Schema({
    first_name:{
        type:String
    },
    last_name:{
        type: String
    },
    email:{
        type: String,
        required:true,
        unique:false,
    },
    designationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Designation',
    },
    supervisorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
    },
    manager:{
        type: String
    },
    birthday:{
        type: Date
    },
    managerEmail:{
        type: String
    },
    contactNo:{
        type: Number
    },
    password:{
        type: String
    },
},{
    collection: 'employee'
});

module.exports = mongoose.model('Employee', Employee);