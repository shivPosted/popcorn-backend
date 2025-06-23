import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addUserMovie } from "../controllers/movie.controller.js";

const movieRouter = Router();

//secured routes
movieRouter.route("/addMovie").post(verifyJWT, addUserMovie);

export default movieRouter;
