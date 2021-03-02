const mongoose = require("mongoose");
const User = require("../models/user");
const ErrorResponse = require("../../utils/error");

exports.addUser = async (req, res, next) => {
  const user = await new User(req.body);

  try {
    const token = await user.getJWT();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserOnLogin(email, password);
    const token = await user.getJWT();

    res.send({ success: true, user });
  } catch (error) {
    next(new ErrorResponse("Bad Request", 401));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) return res.send("No Users In Database");
    const count = users.length;
    res.json({ success: true, count, users });
  } catch (error) {
    next(new ErrorResponse());
  }
};

exports.getAllBlogsByUser = async (req, res, next) => {
  try {
    const blogs = await req.user.populate("blogs").execPopulate();

    if (!blogs) return "No blogs for user";
    const count = req.user.blogs.length;
    res.json({ count, blogs: req.user.blogs });
  } catch (error) {
    next(new ErrorResponse());
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(401)
        .send({ success: true, message: "The user doesn't exist" });
    await user.remove();
    res.send({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    next(new ErrorResponse());
  }
};
