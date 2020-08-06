const express = require('express');
const nodemailer = require('nodemailer');
const calendarEventRoutes = express.Router();

let CalendarEvent = require('./calendarEvent.model');
var mongoose = require('mongoose');
// const transporter = require('./mail')
let http = require('http');
let url = require('url') ;


// var hostname = req.headers.host; // hostname = 'localhost:8080'

const getDiffDays = (start, end) => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

}

const createCalenderEvent = (calendarEvent, res) => {
    calendarEvent.save()
        .then(async calendarEvent=>{
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                service: 'gmail',
                auth: {
                    user: 'shankaarunoda96@gmail.com', // generated ethereal user
                    pass: 'A1996@shanka', // generated ethereal password
                },
            });

            const mailOptions = {
                from: calendarEvent.email, // sender address
                to: calendarEvent.managerEmail, // list of receivers
                subject: calendarEvent.leaveType + " - " + calendarEvent.employeeName + " (" + calendarEvent.startDate + " - " + calendarEvent.endDate + ") ", // Subject line
                html: '<p>Hi ' + calendarEvent.manager + ',</p>' +
                    '<a href=http://localhost:3000/leaves/edit/' + calendarEvent.id + '>Link</a>',
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });



            res.status(200).json({'status': true, 'calendarEvent':'new calendarEvent added success!'});
        })
        .catch(err =>{
            res.status(400).send(err.message);
        });
}

//POST DATA
calendarEventRoutes.route('/add').post(function (req,res){
    const calendarEvent = new CalendarEvent(req.body);
    // Check Leave Availability
    const LeaveAllocationModel = mongoose.model('LeaveAllocate');

    try{
        if(req.body.needLeaveAllocationValidation){
            LeaveAllocationModel.find({employeeId:req.body.employeeId, leaveTypeId:req.body.leaveTypeId,leaveAllocate_status:true, year:new Date().getFullYear().toString()}, function(err, allocations){
                if(allocations){
                    const leaveAmount = allocations.reduce((accumulator, currentValue) => {return accumulator + currentValue.leaveAmount}, 0);

                    CalendarEvent.find({employeeId:req.body.employeeId, leaveTypeId:req.body.leaveTypeId, startDate: { $gte: new Date().getFullYear().toString()+'-01-01', $lte: new Date().getFullYear().toString()+'-12-31' }},function (err, CalendarEvents) {
                        if (err)
                            console.log(err.message)
                        else {
                            const leaveUsageAmount = CalendarEvents.reduce((accumulator, currentValue) => {return accumulator + currentValue.leaveAmount}, 0);

                            const leaveAvailableAmount = leaveAmount - (leaveUsageAmount + getDiffDays(req.body.startDate, req.body.endDate))
                            if(leaveAvailableAmount > 0){
                                createCalenderEvent(calendarEvent, res);
                            }else{
                                res.status(200).json({'status': false, 'calendarEvent':'No Leaves Available'});
                            }
                        }
                    })
                }

            }).exec();
        }else{
            createCalenderEvent(calendarEvent, res);
        }
    }catch (e) {
        console.log(e.message)
    }



});



// GET DATA
calendarEventRoutes.route('/').get(function (req,res) {
    CalendarEvent.find(function (err, CalendarEvent) {
        if (err)
            console.log(err)
        else {
            res.json(CalendarEvent)
        }
    })
        .populate('employeeId', ['first_name', 'last_name'])
        .exec();
});


// EDIT
calendarEventRoutes.route('/edit/:id').get(function (req,res) {
    let id = req.params.id;
    CalendarEvent.findById(id,function (err,CalendarEvent) {
        res.json(CalendarEvent);
    })
        .populate('employeeId', ['first_name', 'last_name'])
        .populate('supportiveEmployeeId', ['first_name', 'last_name'])
        .exec();
});


// Leave Approved and mail Settings
calendarEventRoutes.route('/approved/').post(function (req,res) {
    CalendarEvent.findById(req.body.id, function (err,CalendarEvent) {
        if (!CalendarEvent)
            res.status(404).send("data is not found");
        else{
            CalendarEvent.color="#26a69a";
            CalendarEvent.status= "Approved";

            CalendarEvent.save().then(calendarEvent =>{
                res.json('Updated calendar Event');
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    service: 'gmail',
                    auth: {
                        user: 'shankaarunoda96@gmail.com', // generated ethereal user
                        pass: 'A1996@shanka', // generated ethereal password
                    },
                });

                const mailOptions = {
                    from: 'shankaarunoda96@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "http://localhost:3000/leaves/edit/" + calendarEvent.id, // plain text body
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

            }).catch(err=>{
                    res.status(400).send("unable to update")
            });
        }
    });
});

calendarEventRoutes.route('/reject/').post(function (req,res) {
    CalendarEvent.findById(req.body.id, function (err,CalendarEvent) {
        if (!CalendarEvent)
            res.status(404).send("data is not found");
        else{
            CalendarEvent.color="#d32f2f";
            CalendarEvent.status= "Reject";
            CalendarEvent.reject_reason= req.body.reject_reason;

            CalendarEvent.save().then(calendarEvent =>{
                res.json('Updated calendar Event');
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    service: 'gmail',
                    auth: {
                        user: 'shankaarunoda96@gmail.com', // generated ethereal user
                        pass: 'A1996@shanka', // generated ethereal password
                    },
                });

                const mailOptions = {
                    from: 'shankaarunoda96@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "http://localhost:3000/leaves/edit/" + calendarEvent.id, // plain text body
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});


// UPDATE
calendarEventRoutes.route('/update/:id').post(function (req,res) {
    CalendarEvent.findById(req.params.id, function (err,CalendarEvent) {
        if (!CalendarEvent)
            res.status(404).send("data is not found");
        else{
            CalendarEvent.title=req.body.title;
            CalendarEvent.employeeName=req.body.employeeName;
            CalendarEvent.leaveType=req.body.leaveType;
            CalendarEvent.leaveCategory=req.body.leaveCategory;
            CalendarEvent.startDate=req.body.startDate;
            CalendarEvent.endDate=req.body.endDate;
            CalendarEvent.reason=req.body.reason;

            CalendarEvent.save().then(calendarEvent =>{
                res.json('Updated calendar Event');
            })
                .catch(err=>{
                    res.status(400).send("unable to update")
                });
        }
    });
});



// DELETE
calendarEventRoutes.route('/delete/:id').delete(function (req,res) {
    CalendarEvent.findByIdAndRemove({_id:req.params.id}, function (err,CalendarEvent) {
        if (err)res.json(err);
        else res.json('calendar Event Removed');
    });
});


module.exports = calendarEventRoutes;