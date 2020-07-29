const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Designation = new Schema({
    designation_code:{
        type:String
    },
    designation:{
        type: String
    },
    designation_status:{
        type: Boolean
    },
},{
    collection: 'designation'
});

module.exports = mongoose.model('Designation', Designation);