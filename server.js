const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 9000;
const cors = require("cors");

const mongoose = require("mongoose");
const config = require("./DB.js");
const employeeRoutes = require("./employee.route");
const designationRoutes = require("./designation.route");
const calendarEventRoutes = require("./calendarEvent.route");
const leaveTypeRoutes = require("./leaveType.route");
const leaveAllocateRoutes = require("./leaveAllocate.route")
const userRoute  = require("./user.route")

//DB connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true,  }).then(
  () => {
    console.log("Database is ok!");
  },
  (err) => {
    console.log("cannot connect to the DB" + err);
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/employee", employeeRoutes);
app.use("/designation", designationRoutes);
app.use("/calendarEvent", calendarEventRoutes);
app.use("/leaveType", leaveTypeRoutes);
app.use("/leaveAllocate",leaveAllocateRoutes)
app.use('/user',userRoute);
app.set('port', process.env.PORT || 3000)

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method==='OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT, POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next(); // Right here
});

app.listen(port, () => {
  console.log("Server is running at port: " + port);
});
