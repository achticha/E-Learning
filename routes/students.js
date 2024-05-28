//index แสดงหน้าแรก
var express = require('express');
var router = express.Router();
var Student = require("../models/students")
var Classes = require("../models/classes")
var User = require("../models/users")


router.get('/classes', function (req, res, next) {
  Student.getStudentByUserName(req.user.username)
    .then(student => {
      res.render('students/classes', { students: student });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});


router.post("/classes/register", function (req, res, next) {
  var student_username = req.body.student_username;
  var class_id = req.body.class_id;
  var class_title = req.body.class_title
  var img_url = req.body.img_url
  var description = req.body.description
  var instructor = req.body.instructor

 
  info = [];
  info["student_user"] = student_username;
  info["class_id"] = class_id;
  info["class_title"] = class_title;
  info["img_url"] = img_url;
  info["description"] = description;
  info["instructor"] = instructor;

  Student.register(info, function (err, instructor) {
    if (err) throw err;
  });
  res.location("/students/classes");
  res.redirect("/students/classes");
});

module.exports = router;



