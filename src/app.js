import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const whiteList = [
  "http://localhost:5173",
  "https://usepopcorn-shiv.netlify.app/",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whiteList.includes(origin)) {
        // Allow requests with no origin (like mobile apps, curl, Postman) or whitelisted origins
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, //allow cookies
  }),
);

app.use(
  express.json({
    limit: "24kb",
  }),
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "24kb" }));

app.use(express.static("public"));

import userRouter from "./routes/user.route.js";

app.use("/api/v1/popcorn/users", userRouter); //NOTE: tranfering controll to userRouter

//NOTE: for handling errors for the frontend
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});
export default app;
