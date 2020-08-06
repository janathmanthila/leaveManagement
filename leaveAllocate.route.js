const express = require('express');
const leaveAllocateRoutes = express.Router();

let LeaveAllocate = require('./leaveAllocate.model');

//POST DATA
leaveAllocateRoutes.route('/add').post(function (req,res,){

    const {lines, employeeId, year} = req.body

    try{
        lines.map(line => {
            const leaveAllocate = new LeaveAllocate({...line, employeeId, year})
            leaveAllocate.save()
        });
        res.status(200).json({'leaveAllocate':'new leaves Allocation added success!'});
    }catch (e) {
        res.status(400).send("unable to add");
    }

});

// UPDATE
leaveAllocateRoutes.route('/update/:id').post(function (req,res) {
    LeaveAllocate.findById(req.params.id, function (err,leaveAllocation) {
        if (!leaveAllocation)
            res.status(404).send("data is not found!");
        else{

            if (req.body.leaveAllocate_status !== undefined) leaveAllocation.leaveAllocate_status=req.body.leaveAllocate_status;
            if (req.body.leaveAmount !== undefined) leaveAllocation.leaveAmount=req.body.leaveAmount;
            if (req.body.employeeId !== undefined) leaveAllocation.employeeId=req.body.employeeId;
            if (req.body.leaveTypeId !== undefined) leaveAllocation.leaveTypeId=req.body.leaveTypeId;
            if (req.body.year !== undefined) leaveAllocation.year=req.body.year;

            leaveAllocation.save().then(leaveAllocation =>{
                res.json('Updated Leaves');
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});

// GET DATA
leaveAllocateRoutes.route('/').get(function (req,res) {
    LeaveAllocate.find(function (err, leaveAllocation) {
        if (err)
            console.log(err)
        else {
            res.json(leaveAllocation)
        };
    })
        .populate('leaveTypeId', 'leaveType')
        .populate('employeeId', ['first_name', 'last_name'])
        .exec();
});



// DELETE
leaveAllocateRoutes.route('/delete/:id').delete(function (req,res) {
    LeaveAllocate.findByIdAndRemove({_id:req.params.id}, function (err,designation) {
        if (err)res.json(err);
        else res.json('Leave Allocation Removed');
    });
});

module.exports = leaveAllocateRoutes;