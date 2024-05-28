var mongo = require("mongodb");
var mongoose = require("mongoose");
var db = mongoose.connection;
var mongoDB = "mongodb://localhost:27017/ElearningDB"; 
mongoose.connect(mongoDB, {
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb Connect Error"));

var classesSchema = mongoose.Schema({
  class_id: {
    type: String
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  img_url: {
    type: String,
  },
  instructor: {
    type: String,
  },
  lesson: [{
    lesson_number: { type: Number },
    lesson_title: { type: String },
    lesson_body: { type: String }
  }],

});

const Classes = (module.exports = mongoose.model("classes", classesSchema));

module.exports.getClasses = function (limit) {

  return Classes.find().limit(limit).exec();
};

module.exports.getClassID = async function (class_id) {
 
  var query = { 
    class_id: class_id 
  }
  const result = await Classes.findOne(query).exec();
  return result;
};

module.exports.saveNewClass = async function (newClass) {
  try {
    const savedClass = await newClass.save();
    return savedClass;
  } catch (error) { 
    throw error;
  }
};

module.exports.addLesson = function (info) {
  const lesson_number = info["lesson_number"];
  const lesson_title = info["lesson_title"];
  const lesson_body = info["lesson_body"];
  const class_id = info["class_id"];

  return new Promise((resolve, reject) => {
    const query = {
      class_id: class_id,
    };

    Classes.findOneAndUpdate(
      query,
      {
        $push: {
          "lesson": {
            lesson_number: lesson_number,
            lesson_title: lesson_title,
            lesson_body: lesson_body
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

module.exports.updateClassById = async function (classId, updatedClassData) {
  try {
    const updatedClass = await Classes.findOneAndUpdate(
      { _id: classId }, 
      updatedClassData,
      { new: true }
    ).exec();

    return updatedClass;
  } catch (error) {
    throw error;
  }
};

module.exports.getUserByID = async function (id) {
  try {
    const user = await User.findById(id);  
    if (!user) {
      throw new Error("ไม่พบผู้ใช้");
    }
    console.log('user หรออออ', user.type);
    return user;
  } catch (error) {
    throw error;
  }
};