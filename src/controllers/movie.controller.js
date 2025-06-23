import Movie from "../models/movies.model";
import Rating from "../models/ratings.model";
import ApiError from "../util/ApiError";
import Apiresponse from "../util/ApiResponse";
import asyncHandler from "../util/asyncHandler";

const addUserMovie = asyncHandler(async (req, res) => {
  const { title, poster, imdbId, userRating, imdbRating } = req.body;

  //add the movie data if not already in all movie collection
  //update the rating model with the user rating , movieId, userId

  if (!req.user) throw new ApiError(404, "No user found please log in again");

  if (
    [title, poster, imdbId, imdbRating, userRating, runtime].some(
      (item) => !item,
    )
  )
    throw new ApiError(400, "Provide all information about movie");
  let createdMovie;
  let newWatchedMovie;

  const movie = await Movie.findOne({ imdbId });

  if (!movie)
    createdMovie = await Movie.create([
      {
        title,
        poster,
        imdbId,
        imdbRating,
      },
    ]);
  if (!createdMovie) throw new ApiError(500, "Can not add that movie");

  const ratingExists = await Rating.findOne({
    userId: req.user?._id,
    movieId: createdMovie._id,
  });
  if (!ratingExists)
    newWatchedMovie = await Rating.create([
      {
        userId: req.user._id,
        movieId: createdMovie._id,
        userRating,
      },
    ]);

  return res
    .status(201)
    .json(new Apiresponse("Movie added successfully", 201, newWatchedMovie));
});

export { addUserMovie };
