const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: validator } = require("validator");
const Blog = require("./blog");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
    },
    email: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid format");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      minlength: 6,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("blogs",{
    ref: "Blog",
    localField: "_id",
    foreignField: "creator"
})

userSchema.pre("save", async function (req, res, next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
});

userSchema.statics.findUserOnLogin = async (email, password) => {
  const user = await User.findOne({ email });
  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

userSchema.methods.getJWT = async function (req, res, next) {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  await user.tokens.push({ token });
  await user.save();
  return token;
};

userSchema.pre("remove", async function(req,res, next){
    const user = this;
   const blogs = await Blog.deleteMany({creator: user._id});
    next()
})

const User = mongoose.model("User", userSchema);
module.exports = User;
