const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
      default: null,
      lowercase: true,
    }, 
    name: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    imageName: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    role: {
      enum: ["user", "driver"],
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]
      },
    },
    block: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null
    },
    user_device_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    isDeleted: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, process.env.secret_Key);
  user.token = token;
  await user.save();
  return token;
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};
userSchema.index({ location: '2dsphere' });
mongoose.model("Users", userSchema);
