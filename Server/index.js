const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const dbConnectionLink = process.env.MONGO_STRING;
const userRoutes = require("./routes/users");
const videosRoutes = require("./routes/videos");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auths");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Set CORS headers here
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://wideo-client.vercel.app"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

mongoose
    .connect(dbConnectionLink)
    .then(() => {
        console.log("Connected To Mongodb");
    })
    .catch((err) => {
        console.log(err.message);
        throw err;
    });

const allowedOrigins = [
    "http://localhost:1234",
    "https://wideo-client.vercel.app",
    "https://wideo-client-dhruvkaravadiya.vercel.app",
    "https://wideo-client-git-main-dhruvkaravadiya.vercel.app",
    "https://wideo-client-n4chsoics-dhruvkaravadiya.vercel.app",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        limits: { fileSize: 100 * 1024 * 1024 },
    })
);

app.set("view engine", "ejs");

app.get("/api/videos", (req, res) => {
    res.render("newVideo");
});

// app.post("/api/videos", (req, res) => {
//   // Check if files were uploaded
//   if (!req.files || !req.files.photo || !req.files.video) {
//     return res.status(400).send("Photo and Video both files were not uploaded.");
//   }
//   console.log("Photo : " , req.files.photo);
//   console.log("Video : " , req.files.video);
//   // Respond to the client
//   res.send({ "Video": req.files.video, "Photo": req.files.photo });
// });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/comments", commentRoutes);

app.all("/", (req, res) => {
    console.log("Just got a request!");
    res.send("Yo!");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000");
});
