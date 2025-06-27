import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addUserMovie,
  deleteUserMovie,
  getMovies,
} from "../controllers/movie.controller.js";

const movieRouter = Router();

//secured routes
movieRouter.route("/addMovie").post(verifyJWT, addUserMovie);
movieRouter.route("/getMovies").get(verifyJWT, getMovies);
movieRouter.route("/delete").delete(verifyJWT, deleteUserMovie);

export default movieRouter;
