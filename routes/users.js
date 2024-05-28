//Router จัดการผู้ใช้
var express = require('express');
var router = express.Router();
var User = require("../models/users")
var Student = require("../models/students")
var Instructor = require("../models/instructors")
var Classes = require("../models/classes");
const { check, validationResult } = require("express-validator");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


router.get('/register', function(req, res, next) {
  res.render('users/register')
});

router.get('/login', function(req, res, next) {
  res.render('users/register')
});

router.get('/ex', async function(req, res, next) {
  try {
    const student = await User.getUserByID(req.user);
    const classes = await Classes.getClasses(10); 

    res.render('users/ex', { student: student, classes: classes }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    console.log("User logged out successfully");
    res.redirect("/");
  });
});

router.post(
  "/login",
  async (req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, async (err) => {
      try {
        if (err) {
          console.error(err);
          req.flash("error", "เกิดข้อผิดพลาดในการลงชื่อเข้าใช้");
          return res.redirect("/users/login");
        }

        
        req.flash("success", "ลงชื่อเข้าใช้เรียบร้อย");
        var usertype = req.user.type;
        return res.redirect('/' + usertype + 's/classes');
      } catch (error) {
        console.error(error);
        req.flash("error", "เกิดข้อผิดพลาดในการลงชื่อเข้าใช้");
        return res.redirect("/users/login");
      }
    });
  }
);


passport.serializeUser(function (username, done) {
  done(null, username.id); 
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.getUserByID(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.getUserByUserName(username);
      console.log(user);
      if (!user) {
        return done(null, false, { message: "ไม่พบผู้ใช้" });
      } else {
        const isMatch = await User.comparePassword(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    } catch (error) {
      console.error(error);
      return done(error, false, {
        message: "เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้",
      });
    }
  })
);

router.post('/register',[
  check("email", "กรุณาป้อนอีเมลของท่าน").isEmail(),
  check("fname", "กรุณาป้อนชื่อของท่าน").not().isEmpty(),
  check("lname", "กรุณาป้อนนามสกุลของท่าน").not().isEmpty(),
  check("password", "กรุณาป้อนรหัสผ่านของท่าน").not().isEmpty(),
  check("username", "กรุณาป้อน Username").not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
    var errors = result.errors;

    if (!result.isEmpty()) {
      res.render("users/register", { errors: errors });
    } 
    else {
      var username = req.body.username;
      var email = req.body.email;
      var fname = req.body.fname;
      var lname = req.body.lname;
      var type = req.body.type;
      var password = req.body.password;
      var newUser = new User({
        username:username,
        email: email,
        password: password,
        type: type
      });
      if(type=="student"){
        var newStudent=new Student({
          username:username,
          fname:fname,
          lname:lname,
          email:email
        });
        User.saveStudent(newUser,newStudent,function(err,user){
          if(err) throw err
        })
      }else{
        var newInstructor=new Instructor({
          username:username,
          fname:fname,
          lname:lname,
          email:email
      });
      User.saveInstructor(newUser,newInstructor,function(err,user){
        if(err) throw err
    });
  }
}
res.redirect('/');

});

module.exports = router;
