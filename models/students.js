var mongo = require("mongodb");
var mongoose = require("mongoose");
var db = mongoose.connection;

var mongoDB = "mongodb://localhost:27017/ElearningDB"; 
mongoose.connect(mongoDB, {
  useNewUrlParse: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb Connect Error"));

var studentSchema = mongoose.Schema({
  username: {
    type: String,
  },
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: {
    type: String,
  },
  classes: [
    {
      class_id: { type: String }, 
      class_title: { type: String },
      img_url: {type: String},
      description: {type: String},
      instructor: {type: String}, 
    },
  ],
});

const Student = (module.exports = mongoose.model("student", studentSchema));

module.exports.getStudentByUserName = function (username) {
  var query = {
    username: username,
  };

  return Student.findOne(query).exec(); 
};


module.exports.register = function (info) {
  const student_user = info["student_user"];
  const classId = info["class_id"];
  const classTitle = info["class_title"];
  const classUrl = info["img_url"];
  const description = info["description"];
  const instructor = info["instructor"];

  return new Promise((resolve, reject) => {
    const query = {
      username: student_user,
    };

    Student.findOneAndUpdate(
      query,
      {
        $push: {
          "classes": {
            class_id: classId,
            class_title: classTitle,
            img_url: classUrl,
            description: description, 
            instructor: instructor,
          }
        }
      },
      {
        safe: true,
        upsert: true
      }
    )
      .then(updatedInstructor => {
        resolve(updatedInstructor);
      })
      .catch(error => {
        reject(error);
      });
  });
};