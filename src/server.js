const express = require("express");
const colors = require("colors");
const connectDB = require("./db/mongoose");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoute");
// const User = require("./models/user");

connectDB();

const app = express();
app.use(express.json())

const PORT = process.env.PORT;
app.use(blogRoutes);
app.use(userRoutes);



// const main = async () =>{
// const user  = await User.findById('6033549b0f1c0ce21e7373cc');
// await user.populate("blogs").execPopulate();
// console.log(user.blogs)
// }

// main()

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`.bold.yellow);
});
