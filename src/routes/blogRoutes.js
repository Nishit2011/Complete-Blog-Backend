const express = require("express");
const router = new express.Router();
const { addBlog, editBlogById, getBlogsById, deleteBlogById, addComment,getAllCommentsByBlogId,deleteComment } = require("../controllers/blogController");
const { authenticate } = require("../middlewares/authenticate");

router
.post("/blog",authenticate, addBlog)
.get("/blog/:id", authenticate, getBlogsById)
.patch("/blog/:id", authenticate, editBlogById)
.delete("/blog/:id", authenticate, deleteBlogById)
.post("/blog/:id/comment", authenticate, addComment)
.get("/blog/:id/comment", authenticate, getAllCommentsByBlogId)
.delete(`/blogs/:blogid/comment/:commentid`, authenticate, deleteComment)


module.exports = router;