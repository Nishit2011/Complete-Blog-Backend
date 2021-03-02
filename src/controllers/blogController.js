const ErrorResponse = require("../../utils/error");
const Blog = require("../models/blog");

exports.addBlog = async (req, res, next) => {
  try {
    const blog = await new Blog({ ...req.body, creator: req.user._id });
    await blog.populate("users").execPopulate();
    await blog.save();

    res.status(201).send({ success: true, blog });
  } catch (error) {
    next(new ErrorResponse("Can't create account.", 400));
  }
};

exports.getBlogsById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id: blogId, creator: req.user._id });
    console.log(blog);
    res.send({ success: true, blog });
  } catch (error) {
    next(new ErrorResponse("Can't fetch blogs", 500));
  }
};

exports.editBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const args = Object.keys(req.body);

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return "No such blog exists";

    const updatesAllowed = ["title", "content"];

    const bool = args.every((updateField) =>
      updatesAllowed.includes(updateField)
    );
    if (!bool) return next(new ErrorResponse("Please enter correct fields"));
    args.map((arg) => {
      blog[arg] = req.body[arg];
    });
    await blog.save();
    res.send(blog);
  } catch (error) {
    next(new ErrorResponse("Can't Edit", 500));
  }
};

exports.deleteBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findOne({ _id: blogId, creator: req.user._id });
    await blog.remove();
    res.send({ success: true, message: "Deleted successfully!!!" });
  } catch (error) {
    next(new ErrorResponse());
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const user = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    console.log(JSON.stringify(user));
    //console.log(blog.comments);
    if (!blog) {
      return res.send("No blog exists");
    } else {
      // if (blog.comments.postedBy === user && blog.comments.length === 1)
      //   return res.send(
      //     "Already commented! Please delete your comment to add new comment"
      //   );

      const doesCommentexists = blog.comments.filter(
        (comment) => JSON.stringify(comment.postedBy) === JSON.stringify(user)
      );
      if (doesCommentexists.length > 0)
        return res.send(
          "Already commented! Please delete your comment to add new comment"
        );
      blog.comments.push({ content: req.body.content, postedBy: user });
      // await blog.populate("creator").execPopulate();
      // await blog.populate("comments.postedBy").execPopulate();
      await blog.save();
      res.send({ success: true, message: "Comment added", blog });
    }
  } catch (error) {
    next(new ErrorResponse());
  }
};

exports.getAllCommentsByBlogId = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findOne({ _id: blogId, creator: req.user._id });
    if (!blog) return res.send("No blog exists");
    await blog.populate("creator").execPopulate();
    await blog.populate("comments.postedBy").execPopulate();
    res.send(blog);
  } catch (error) {
    next(new ErrorResponse());
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { blogid, commentid } = req.params;
    const blog = await Blog.findOne({ _id: blogid });

    if (!blog) return res.send("Blog doesn't exist.");

    // res.send(updatedBlog)
    const updateBlog = blog.comments.filter((comment, index) => {
      if (JSON.stringify(comment._id) === JSON.stringify(commentid)) {
        blog.comments.splice(index, 1);
      }
    });
    await blog.save();
    res.send(blog);
  } catch (error) {
    next(new ErrorResponse());
  }
};
