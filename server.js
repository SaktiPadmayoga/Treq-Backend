require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const eventRoutes = require("./routes/eventRoutes");
const examRoutes = require("./routes/examRoutes");
const path = require("path");

app.use(
    cors(
        {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }
    )
);

//Database Connection
connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/exams", examRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));


//Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server is running on port ${port}`);});

