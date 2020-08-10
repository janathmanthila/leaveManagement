const express = require("express");
const holidayRoutes = express.Router();
const Holiday = require('./holiday.model');
const mongoose = require('mongoose');
const todayDate = new Date();
const axios = require('axios');
const nodemailer = require("nodemailer");
const Employee = require("./employee.model")

holidayRoutes.route("/").get(function (req, res) {
    Holiday.find(function (err, holiday) {
        if (err)
            console.log(err)
        else {
            res.json(holiday)
        };
    });
});

var CronJob = require('cron').CronJob;
var job = new CronJob('0 0 1 1 *', function() {
    const HolidayModel = mongoose.model('Holiday');
    axios.get('https://calendarific.com/api/v2/holidays?api_key=4ce1eda6ecb0568a24d2097df4d8e41f07ff62eb&country=LK&year=' + todayDate.getFullYear())
        .then(response => {
            if(response.data.response.holidays) {
                response.data.response.holidays.forEach(holiday => {
                    if(holiday.type[0] === "National holiday") {
                        HolidayModel.create({
                            holidayName: holiday.name,
                            holidayType: holiday.type[0],
                            holidayDescription: holiday.description,
                            startDate: holiday.date.datetime.year + '-' + holiday.date.datetime.month + '-' + holiday.date.datetime.day,
                            endDate: holiday.date.datetime.year + '-' + holiday.date.datetime.month + '-' + holiday.date.datetime.day,
                        })
                    }
                })
                console.log('Executed');
            }
        })
        .catch(error => {
            console.log(error);
        });

}, null, true, 'Asia/Colombo');
job.start();

var holidayMail = new CronJob('0 9 * * *', function () {
    Employee.find(function (err, employees) {
        if(employees) {
            var emails = ""
            employees.map((employee) => {
                emails += employee.email + ';';
            });
        }
    });

    const tomorrow = new Date()
    tomorrow.setDate(new Date().getDate() + 1)
    const tomorrowStr = tomorrow.getFullYear() + '-' + tomorrow.getMonth() + '-' + tomorrow.getDate();

    Holiday.findOne({startDate: tomorrowStr}, function (error, holiday) {
        if(holiday) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                service: "gmail",
                auth: {
                    user: "shankaarunoda96@gmail.com", // generated ethereal user
                    pass: "A1996@shanka", // generated ethereal password
                },
            });

            const mailOptions = {
                from: "shankaarunoda96@gmail.com", // sender address
                to: emails,
                subject: "Reminder - " + holiday.holidayName + '(' + holiday.startDate + ')',
                html:
                    "<p>Hi All</p><br/>" +
                    "Tomorrow is holiday for Sri Lankan Team, Have a great holiday.<br/>" +
                    "<small>This is a system generated email, <br/> Thanks.</small>",
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }
    })

}, null, true, 'Asia/Colombo')
holidayMail.start();

module.exports = holidayRoutes;
