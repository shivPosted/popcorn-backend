import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
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
app.use((err, _, res, _) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});
export default app;
