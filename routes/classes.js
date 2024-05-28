//index แสดงหน้าแรก
var express = require("express");
var router = express.Router();
var Classes = require("../models/classes");
var Instructor = require("../models/instructors");
var User = require("../models/users")

router.post("/register", function (req, res, next) {
  var class_id = req.body.class_id;
  var class_name = req.body.class_name;
  var description = req.body.description;
  var instructor = req.body.instructor;
  var img_url = req.body.img_url;

  var newClass = new Classes({
    class_id: class_id,
    title: class_name,
    description: description,
    instructor: instructor,
    img_url: img_url
  });
  info = [];
  info["instructor_user"] = req.user.username;
  info["class_id"] = class_id;
  info["class_title"] = class_name;
  info["img_url"] = img_url;
  info["description"] = description;
  info["instructor"] = instructor;
  
  Classes.saveNewClass(newClass, function (err, student) {
    if (err) throw err;
  });

  Instructor.register(info, function (err, instructor) {
    if (err) throw err;
  });

  res.location("/instructors/classes");
  res.redirect("/instructors/classes");
});


//สร้างhttp://localhost:3000/classes/som101/lesson คือการแสดงบทเรียนทั้งหมดที่อยู่ในclass id
router.get("/:id/lesson", async function (req, res, next) {
  try {
    const student = await User.getUserByID(req.user);
    const className = await Classes.getClassID([req.params.id]);
    res.render("classes/viewlesson", { className: className, student: student });

  } catch {
    res.status(999).send("error");
  }
});

router.get("/:id/edit", async function (req, res, next) {
  try {
    const className = await Classes.getClassID([req.params.id]);
    res.render("classes/edit", { className: className });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving class data.");
  }
});

router.post("/:id/edit", async function (req, res, next) {
  try {
    const classId = req.params.id;
    const updatedClassData = {
      title: req.body.title,
      description: req.body.description,
      img_url: req.body.img_url,
    };


    if (!updatedClassData.title || !updatedClassData.description || !updatedClassData.img_url) {
      throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    await Classes.updateOne({ _id: classId }, updatedClassData);
    res.redirect(`/classes/${classId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating class data: " + error.message);
  }
});



//สร้างhttp://localhost:3000/classes/som101/lesson... ในส่วนของ view เนื้อหาในบทเรียน
router.get("/:id/lesson/:lesson_id", async function (req, res, next) {
  try {
    const student = await User.getUserByID(req.user);
    const className = await Classes.getClassID([req.params.id]);
    let lesson;
    for (var i = 0; i < className.lesson.length; i++) {
      if (className.lesson[i].lesson_number == req.params.lesson_id) {
        lesson = className.lesson[i];
        break;
      }
    }
    if (!lesson) {
      return res.status(404).send("บทเรียนที่คุณต้องการไม่พบ");
    }
    res.render("classes/lesson", { className: className, lesson: lesson ,student: student });
  } catch (error) {
    console.error(error);
    res.status(999).send("error");
  }
});

module.exports = router;




