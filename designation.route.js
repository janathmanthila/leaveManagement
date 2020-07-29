const express = require('express');
const designationRoutes = express.Router();

let Designation = require('./designation.model');
var mongoose = require('mongoose');

//POST DATA
designationRoutes.route('/add').post(function (req,res){
    let designation = new Designation(req.body);
    designation.save()
        .then(designation=>{
            res.status(200).json({'designation':'new designation added success!'});
        })
        .catch(err =>{
            res.status(400).send("unable to add");
        });
});

// GET DATA
designationRoutes.route('/').get(function (req,res) {
    Designation.find(function (err, designation) {
        if (err)
            console.log(err)
        else {
            res.json(designation)
        };
    });
});


// EDIT
designationRoutes.route('/edit/:id').get(function (req,res) {
    let id = req.params.id;
    Designation.findById(id,function (err,designation) {
        res.json(designation);
    });
});


// UPDATE
designationRoutes.route('/update/:id').post(function (req,res) {
    Designation.findById(req.params.id, function (err,designation) {
        if (!designation)
            res.status(404).send("data is not found!");
        else{

            if (req.body.designation_code !== undefined) designation.designation_code=req.body.designation_code;
            if (req.body.designation !== undefined) designation.designation=req.body.designation;
            if (req.body.designation_status !== undefined) designation.designation_status=req.body.designation_status;

            designation.save().then(designation =>{
                res.json('Updated designation');
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});



// DELETE
designationRoutes.route('/delete/:id').delete(function (req,res) {
    var id = req.params.id;
    const EmployeeModel = mongoose.model('Employee');

    EmployeeModel.findOne({designationId:id}, function(err, events) {
        if(err){
            console.log(err);
            res.status(400).send("unable to find");
        }else {
            if(!events){
                Designation.findByIdAndRemove({_id:req.params.id}, function (err,designation) {
                    if (err)res.json(err);
                    else res.json('Designation Removed');
                });
            }
            else {
                console.log(events);
                res.status(404).send("Can't delete this designation");
            }

        }
    }).exec();
});


module.exports = designationRoutes;