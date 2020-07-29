const express = require('express');
const leaveTypeRoutes = express.Router();
var mongoose = require('mongoose');

let LeaveType = require('./leaveType.model');

//POST DATA
leaveTypeRoutes.route('/add').post(function (req,res){
    let leaveType = new LeaveType(req.body);
    leaveType.save()
        .then(leaveType=>{
            res.status(200).json({'leaveType':'new leave type added success!'});
        })
        .catch(err =>{
            res.status(400).send("unable to add");
        });
});

// GET DATA
leaveTypeRoutes.route('/').get(function (req,res) {
    LeaveType.find(function (err, leaveType) {
        if (err)
            console.log(err)
        else {
            res.json(leaveType)
        };
    });
});

// EDIT
leaveTypeRoutes.route('/edit/:id').get(function (req,res) {
    let id = req.params.id;
    LeaveType.findById(id,function (err,leaveType) {
        res.json(leaveType);
    });
});


// UPDATE
leaveTypeRoutes.route('/update/:id').post(function (req,res) {
    LeaveType.findById(req.params.id, function (err,leaveType) {
        if (!leaveType)
            res.status(404).send("data is not found!");
        else{

            if (req.body.leaveType_code !== undefined) leaveType.leaveType_code=req.body.leaveType_code;
            if (req.body.leaveType !== undefined) leaveType.leaveType=req.body.leaveType;
            if (req.body.leaveType_status !== undefined) leaveType.leaveType_status=req.body.leaveType_status;

            leaveType.save().then(leaveType =>{
                res.json('Updated designation');
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});

// DELETE
leaveTypeRoutes.route('/delete/:id').delete(function (req,res) {
    var id = req.params.id;
    const LeaveAllocate = mongoose.model('LeaveAllocate');

    LeaveAllocate.findOne({leaveTypeId:id}, function(err, events) {
        if(err){
            console.log(err);
            res.status(400).send("unable to find");
        }else {
            if(!events){
                LeaveType.findByIdAndRemove({ _id: req.params.id }, function (err, leaveType) {
                    if (err) res.json(err);
                    else res.json("Leave Type Removed");
                });
            }
            else {
                // console.log(events);
                res.status(404).send("Can't delete this Type");
            }

        }
    }).exec();
});


module.exports = leaveTypeRoutes;