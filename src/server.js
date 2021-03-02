const express = require("express");
const colors = require("colors");
const connectDB = require("./db/mongoose");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoute");
const errorHandler = require("./middlewares/errorHandler");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJson = require("../swagger.json");

connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Extended: https://swagger.io/specification/#infoObject
// const swaggerOptions = {
//   swaggerDefinition: swaggerJson,

//   apis: [blogRoutes, userRoutes],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(blogRoutes);
app.use(userRoutes);
app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "The requested resource was not found",
  });
});
app.use("/", (req, res) => {
  res.send("Blog Backend is up!!");
});

app.listen(PORT, () => {
  console.log(`The Server is listening on ${PORT}`.bold.yellow);
});
