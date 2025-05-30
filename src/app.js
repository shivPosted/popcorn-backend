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

app.use(express.static("public"));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "24kb" }));

import userRouter from "./routes/user.route.js";

app.use("/api/v1/popcorn/users", userRouter); //NOTE: tranfering controll to userRouter

export default app;
