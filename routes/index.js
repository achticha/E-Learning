//index แสดงหน้าแรก
var express = require('express');
var router = express.Router();
var Classes = require('../models/classes');
var path = require('path');
var Student = require("../models/students");

router.get('/', function(req, res, next) {
  Classes.getClasses(100) 
    .then(classes => {
      res.render('index.ejs', { classes: classes });
    })
    .catch(err => {
      console.error(err);
      res.render('error', { message: 'Error fetching classes', error: err });
    });
});

router.get('/users/newpage', function(req, res, next) {
  Classes.getClasses(100)
    .then(classes => {
      res.render('users/newpage', { classes: classes });
    })
    .catch(err => {
      console.error(err);
      res.render('error', { message: 'Error fetching classes', error: err });
    });
});

router.get('/classes/course',async function(req, res, next) {
  try {
    const classes = await  Classes.getClasses(100);
    const student = await  Student.getStudentByUserName(req.user.username)
    res.render("classes/course", { classes: classes, students: student });
  } catch {
    res.status(404).send("error 404");
  }
});

module.exports = router;
