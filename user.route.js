const express = require("express");
const userRoutes = express.Router();
const nodemailer = require("nodemailer");
var sha1 = require("sha1");
const jwt = require('jsonwebtoken');
var verifyToken = require("./verify_token");
let User = require('./user.model');
var async = require("async");
var crypto = require("crypto");


userRoutes.route('/ad').post(function (req,res){
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)

    if(typeof bearerHeader !== 'undefined'){
        //split at the space
        const bearer = bearerHeader.split(' ');
        //  get token from array
        const beaerToken = bearer[1];
        //  set the token
        req.token = beaerToken;
        //  next middleware
        console.log("done")
        next();
    }else {
        //  Forbidden
        res.sendStatus(403)
    }

});


userRoutes.route('/add').post(function (req,res){

    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = 10;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    req.body["password"] = sha1(result);


    let user = new User(req.body);

    // async.waterfall([
    // function(done) {
    //     crypto.randomBytes(20, function(err, buf) {
    //         var token = buf.toString('hex');
    //         done(err, token);
    //     });
    // },
    // function(token, done) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
                user: "summitlktest@gmail.com", // generated ethereal user
                pass: "summitpassword", // generated ethereal password
            },
        });

        const mailOptions = {
            from: "summitlktest@gmail.com", // sender address
            to: user.email, // list of receivers
            subject: "Invitation", // Subject line
            // html:
            //     "<p>Hi " +
            //     user.user_name +
            //     ",</p></br>" +
            //     "<p>Password : " +
            //     result +
            //     "</p>",
            text:
                'Hi'+user.user_name+ 'Password:'+ result+'\n\n' +
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' +  '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

    // },
    //     ],

    user.save()
        .then(user=>{
            res.status(200).json({'user':'stnew user added success!'});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        })
// )
});


// userRoutes.route('/add').post(function (req,res){
//     let user = new User(req.body);
//     user.save()
//         .then(user=>{
//             res.status(200).json({'user':'new user added success!'});
//         })
//         .catch(err =>{
//             res.status(400).send("unable to add");
//         });
// });

userRoutes.route('/login').post(function(req,res){
    User.findOne({
        email:req.body.email,
        password: sha1(req.body["password"])
    },function (user_find_error,user) {
        jwt.sign({user}, 'secretkey', (err, token) => {
            console.log("token is : "+token)

            if(user_find_error){
                console.log(err)
                res.sendStatus(500)
            }
            if(!user){
                console.log("User does not exists")
                res.sendStatus(400)
            }
            res.json({
                token:token,
                user_id: user.id,
                user_name: user.user_name
            })

        })
    })
});

userRoutes.route('/').get(function (req,res) {
    User.find(function (err, User) {
        if (err)
            console.log(err)
        else {
            res.json(User)
        };
    }).populate('employeeId', 'first_name').exec();
});

userRoutes.route('/edit/:id').put(function (req,res) {
    let id = req.params.id;
    User.findById(id,function (err,User) {
        res.json(User);
    });
});

userRoutes.route('/edit/:id').put(function (req,res) {
    let id = req.params.id;
    User.findById(id,function (err,User) {
        res.json(User);
    });
});


// userRoutes.route('/reset/:id').put(function (req,res) {
//     User.findOne({
//         id: req.params.id,
//         password: sha1(req.body["current_password"])
//     },function (user_find_error,user) {
//         // jwt.sign({user}, 'secretkey', (err, token) => {
//         //     // console.log("token is : "+token)
//         //     console.log("user is : "+user.id)
//         //     // console.log("user is : ")
//
//             if(user_find_error){
//                 console.log(err)
//                 // res.json({
//                 //     message:"error occurred"
//                 // })
//                 res.sendStatus(500)
//             }
//             if(!user){
//                 console.log("User does not exists")
//                 res.sendStatus(403)
//             }
//             let id = req.params.id;
//             User.findById(id,function (err,User) {
//                 res.json(User);
//             });
//         // })
//     })
//     // if(req.params.password == user.password){
//     //     let id = req.params.id;
//     //     User.findById(id,function (err,User) {
//     //         res.json(User);
//     //     });
//     // }
//
// });

userRoutes.route('/reset/:id').put(function (req,res) {
    let id = req.params.id;
    let new_password = sha1(req.body["password"])
    User.findById(id,function (err,User) {
        // res.json(User);
        if(err){
            res.sendStatus(500)
        }

        if(!User){
            console.log("User does not exists")
            res.sendStatus(400)
        }else {
            if (User.password == sha1(req.body["current_password"])) {
                User.password = new_password

                User.save().then(User => {
                    // res.json('Updated User');
                    res.json({'status': 200, 'user': User});
                })
                    .catch(err => {
                        res.json("unable to update")
                    });

            } else {
                console.log("Current Password is incorrect")
                res.json({'status': 201});
            }
        }
    });
})

//DELETE
userRoutes.route('/delete/:id').delete(function (req,res) {
    User.findByIdAndRemove({_id:req.params.id}, function (err,User) {
        if (err)res.json(err);
        else res.json('User Removed');
    });
});

userRoutes.route('/update/:id').post(function (req,res) {
    User.findById(req.params.id, function (err,User) {
        if (!User)
            res.status(404).send("data is not found");
        else{
            User.user_name=req.body.user_name;
            User.email=req.body.email;
            User.employeeId=req.body.employeeId;

            User.save().then(User =>{
                res.json('Updated User');
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});

module.exports = userRoutes;
