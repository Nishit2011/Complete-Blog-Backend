const Blog = require("../models/blog");


exports.addBlog = async (req, res, next)=>{
    try {
        const blog = await new Blog({...req.body, creator: req.user._id});
        await blog.populate("users").execPopulate()
        await blog.save();
        
        res.status(201).send({success: true, blog})
    } catch (error) {

        res.status(400).json({error})
    }


}

exports.getBlogsById = async(req, res, next) =>{
    
    try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({_id:blogId, creator: req.user._id});
    console.log(blog);
    res.send({success: true, blog});

    } catch (error) {
        res.status(500).send()
    }
}


exports.editBlogById = async (req, res, next) =>{
    const blogId = req.params.id;
    const args = Object.keys(req.body)
   
    try {
        const blog = await Blog.findById(blogId);
        if(!blog) return "No such blog exists"
        
        const updatesAllowed = ["title", "content"];

        const bool = args.every(updateField =>  updatesAllowed.includes(updateField))
        if(!bool) return res.send("Please enter correct fields")
        args.map(arg=>{
            blog[arg] = req.body[arg]
        })
        await blog.save();
        res.send(blog)

    } catch (error) {
        res.status(500).send()
    }
}

exports.deleteBlogById = async (req, res, next) =>{
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId);
        await blog.remove()
        res.send({success: true, message: "Deleted successfully!!!"})
    } catch (error) {
        res.status(500).send('Error')
    }
}