require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(
    cors(
        {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }
    )
);

//Middleware
app.use(express.json());

//Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/subjects", subjectRoutes);
// app.use("/api/events", eventRoutes);


//Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server is running on port ${port}`);});

