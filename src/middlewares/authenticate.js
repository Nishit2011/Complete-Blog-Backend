const jwt = require("jsonwebtoken");
const ErrorResponse = require("../../utils/error");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded, "tokens.token": token });
    if (!user) return res.send("No users found");
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new ErrorResponse("Please authenticate", 401));
  }
};
