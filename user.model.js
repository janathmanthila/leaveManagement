const mongoose = require('mongoose');
const  Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

let User = new Schema({
    user_name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String
    },
    create_new: {
        type: Boolean,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "Employee"
    },
    isInitialLogin: {
        type: Boolean
    },
    // resetPasswordToken: {
    //     type: String,
    //     required: false
    // },
    //
    // resetPasswordExpires: {
    //     type: Date,
    //     required: false
    // }
},{
    collection: 'user'
});

// User.methods.comparePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };
//
// User.methods.generateJWT = function() {
//     const today = new Date();
//     const expirationDate = new Date(today);
//     expirationDate.setDate(today.getDate() + 60);
//
//     let payload = {
//         id: this._id,
//         email: this.email,
//         user_name: this.user_name,
//     };
//
//     return jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
//     });
// };
//
// User.methods.generatePasswordReset = function() {
//     this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//     this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
// };


module.exports = mongoose.model('User', User);