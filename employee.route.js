const express = require("express");
const employeeRoutes = express.Router();
const nodemailer = require("nodemailer");
var sha1 = require("sha1");

var mongoose = require('mongoose');


let Employee = require("./employee.model");

//POST DATA
employeeRoutes.route("/add").post(function (req, res) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = 10;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  req.body["password"] = sha1(result);
  let employee = new Employee(req.body);
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
    to: employee.email, // list of receivers
    subject: "Invitation", // Subject line
    html:
      "<p>Hi " +
      employee.first_name +
      " " +
      employee.last_name +
      ",</p></br>" +
      "<p>Password : " +
      result +
      "</p>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  employee
    .save()
    .then((employee) => {
      res.status(200).json({ employee: "new employee added success!" });
    })

    .catch((err) => {
      res.status(400).send("unable to add");
    });
});

// GET DATA
employeeRoutes.route("/").get(function (req, res) {
  Employee.find(function (err, employee) {
    if (err) console.log(err);
    else {
      res.json(employee);
    }
  }).populate('designationId', 'designation').exec();
});

// EDIT
employeeRoutes.route("/edit/:id").get(function (req, res) {
  let id = req.params.id;
  Employee.findById(id, function (err, employee) {
    res.json(employee);
  });
});

// UPDATE
employeeRoutes.route("/update/:id").post(function (req, res) {
  Employee.findById(req.params.id, function (err, employee) {
    if (!employee) res.status(404).send("data is not found");
    else {
      if (req.body.first_name !== undefined) employee.first_name=req.body.first_name;
      if (req.body.last_name !== undefined) employee.last_name=req.body.last_name;
      if (req.body.email !== undefined) employee.email=req.body.email;
      if (req.body.contactNo !== undefined) employee.contactNo=req.body.contactNo;
      if (req.body.manager !== undefined) employee.manager=req.body.manager;
      if (req.body.birthday !== undefined) employee.birthday=req.body.birthday;
      if (req.body.designationId !== undefined) employee.designationId=req.body.designationId;
      if (req.body.supervisorId !== undefined) employee.supervisorId=req.body.supervisorId;

      employee
        .save()
        .then((employee) => {
          res.json("Updated Employee");
        })
        .catch((err) => {
          res.status(400).send("unable to update");
        });
    }
  });
});


// DELETE
employeeRoutes.route("/delete/:id").delete(function (req, res) {

  var id = req.params.id;
  // var Schema = mongoose.Schema;
  const CalendarEvent = mongoose.model('CalendarEvent');

  const LeaveAllocate = mongoose.model('LeaveAllocate');
  try {
    LeaveAllocate.findOne({employeeId:id}, function(err, events) {
        if(events){
          // console.log(events);
          res.status(200).json({'status': false, 'Employee':'Can\'t delete this Employee. There are leave allocations for this employee'});
        }else{
          CalendarEvent.findOne({employeeName:id}, function(err, events) {
              if(events){
                // console.log(events);
                res.status(200).json({'status': false, 'Employee':'Can\'t delete this Type. There are Leave requests for this employee'});
              }else{
                Employee.findByIdAndRemove({ _id: req.params.id }, function (err, leaveType) {
                  if (err) res.json(err);
                  else res.status(200).json({'status': true, 'Employee':'Employee Removed'});
                });
              }


          }).exec();
        }
    }).exec();

    // If no constraints, we can delete the document.


  }catch (e) {
    console.log(e.message)
  }


});

//auth
employeeRoutes.route("/auth").post(function (req, res) {
  var query = { email: req.body.email, password: sha1(req.body.password) };
  Employee.findOne()
    .where(query)
    .exec(function (err, employee) {
      if (employee) {
        res.json(employee);
      } else {
        console.log(err);
      }
    });
});

module.exports = employeeRoutes;
