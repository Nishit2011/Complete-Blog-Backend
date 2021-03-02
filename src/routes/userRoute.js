const express = require("express");
const {
  addUser,
  loginUser,
  getAllUsers,
  getAllBlogsByUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authenticate");
const router = new express.Router();

router
  .post("/user", addUser)
  .post("/user/login", loginUser)
  .get("/users", getAllUsers)
  .get("/allblogs", authenticate, getAllBlogsByUser)
  .delete("/user/:id", authenticate, deleteUser);

module.exports = router;
