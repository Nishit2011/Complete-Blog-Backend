const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    console.log(`Mongodb connect to ${conn.connection.host}`.bold.cyan)
}

module.exports = connectDB;