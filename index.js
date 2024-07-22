const express = require("express");
const connectDB = require("./src/config/db.js");
require("dotenv").config();
const usersRoutes = require("./src/routes/usersRoutes.js");
const booksRoutes = require("./src/routes/booksRoutes.js");
const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cors());


// Database Connection
connectDB();


// routes
app.use("/api/users", usersRoutes);
app.use("/api/books", booksRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

