//index แสดงหน้าแรก
var express = require('express');
var router = express.Router();
var Instructor = require("../models/instructors")
var Classes = require("../models/classes")

module.exports.getInstructorsByUserName = function(username) {
    var query = {       
        username: username,
    };
    return new Promise((resolve, reject) => {
        Instructor.findOne(query, (err, instructor) => {
            if (err) {
                reject(err);
            } else {
                 resolve(instructor);
            }
        });
    });
};

router.get('/classes', function (req, res, next) {
    Instructor.getInstructorsByUserName(req.user.username)
        .then(instructor => {
            res.render('instructors/classes', { instructor: instructor });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

router.get('/addclass', function (req, res, next) {
    Instructor.getInstructorsByUserName(req.user.username)
        .then(instructor => {
            res.render('instructors/addclass', { instructor: instructor });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

router.get('/classes/:id/lesson/new', function (req, res, next) {
    res.render('instructors/newlesson', { class_id: req.params.id })
});


router.get("/classes/:id/edit", async function (req, res, next) {
  try {
    const classId = req.params.id;
    const classData = await Classes.getClassById(classId)
    res.render("instructors/edit", { classData: classData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving class data.");
  }
});


router.post('/classes/:id/lesson/new', function (req, res, next) {
    info = [];
    info["class_id"] = req.params.id;
    info["lesson_number"] = req.body.lesson_number; //[index ตำแหน่งที่0]
    info["lesson_title"] = req.body.lesson_title;
    info["lesson_body"] = req.body.lesson_body;

    Classes.addLesson(info, function (err, lesson) {
        if (err) throw err;
    })
    res.location('/instructors/classes');
    res.redirect('/instructors/classes');
});



module.exports = router;



