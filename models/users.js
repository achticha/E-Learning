var mongoose = require("mongoose");
var db = mongoose.connection;
var mongoDB = "mongodb://localhost:27017/ElearningDB"; 
var bcrypt = require("bcryptjs");

mongoose.connect(mongoDB, {
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb Connect Error"));

var userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
  },
});

const User =  (module.exports = mongoose.model("user", userSchema));

module.exports.saveStudent = async function (newUser, newStudent) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;

  try {
    await newUser.save();
    await newStudent.save();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports.saveInstructor = async function (newUser, newInstructor) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;

  try {
    await newUser.save();
    await newInstructor.save();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports.getUserByID = async function (id) {
  try {
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error("ไม่พบผู้ใช้");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports.getUserByUserName = function (username) {
  return new Promise((resolve, reject) => {
    try {
      var query = {       
          username: username,
      };
      User.findOne(query)
        .then((user) => {
          if (!user) {
            resolve(null); 
          } else {
            resolve(user);
            
          }
        })
        .catch((error) => {
          reject(error); 
        });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.comparePassword = function (password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

module.exports.getUsersByType = function (type) {
  console.log("type is " + type);
  var query = {
    type: type,
  };
  return User.find(query).select('type').exec();
};

