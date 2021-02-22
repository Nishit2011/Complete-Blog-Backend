const express = require("express");
const router = new express.Router();
const { addBlog, editBlogById, getBlogsById, deleteBlogById } = require("../controllers/blogController");
const { authenticate } = require("../middlewares/authenticate");

router
.post("/blog",authenticate, addBlog)
.get("/blog/:id", authenticate, getBlogsById)
.patch("/blog/:id", authenticate, editBlogById)
.delete("/blog/:id", authenticate, deleteBlogById)


module.exports = router;