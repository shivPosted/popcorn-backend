import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { addUserMovie } from "../controllers/movie.controller";

const movieRouter = Router();

//secured routes
movieRouter.route("/addMovie").post(verifyJWT, addUserMovie);

export default movieRouter;
