import Movie from "../models/movies.model.js";
import Rating from "../models/ratings.model.js";
import ApiError from "../util/ApiError.js";
import Apiresponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";

const addUserMovie = asyncHandler(async (req, res) => {
  const { title, poster, imdbId, userRating, imdbRating, runtime } = req.body;

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

  if (!movie) {
    createdMovie = await Movie.create([
      {
        title,
        poster,
        imdbId,
        imdbRating,
        runtime,
      },
    ]);

    if (!createdMovie) throw new ApiError(500, "Can not add that movie");
  }

  const ratingExists = await Rating.findOne({
    $and: [
      {
        userId: req.user?._id,
      },
      {
        movieId: movie ? movie._id : createdMovie[0]?._id,
      },
    ],
  });

  if (!ratingExists)
    newWatchedMovie = await Rating.create([
      {
        userId: req.user._id,
        movieId: movie ? movie._id : createdMovie[0]?._id,
        userRating,
      },
    ]);

  if (ratingExists)
    return res
      .status(200)
      .json(new Apiresponse("Movie alredy in watchlist", 200, { movie }));

  return res
    .status(201)
    .json(
      new Apiresponse("Movie added successfully", 201, movie || createdMovie),
    );
});

const getMovies = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(404, "No user found please log in");

  const ratingList = await Rating.find({
    userId: req.user._id,
  }).populate("movieId");

  if (ratingList.length === 0)
    return res.status(200).json(new Apiresponse("Empty List", 200, []));

  const movieList = ratingList?.map((item) => {
    return {
      title: item.movieId.title,
      poster: item.movieId.poster,
      imdbId: item.movieId.imdbId,
      imdbRating: item.movieId.imdbRating,
      userRating: item.userRating,
      runtime: item.runtime,
    };
  });

  return res
    .status(200)
    .json(new Apiresponse("Fetched user movie list", 200, movieList));
});

const deleteUserMovie = asyncHandler(async (req, res) => {
  console.log("inside delete movie");
  if (!req.user)
    throw new ApiError(404, "You are not authorized to perform that action");
  const { imdbId } = req.query;

  const movieObjectId = await Movie.findOne({
    imdbId,
  }).select("_id");

  const movieToDelte = await Rating.deleteOne({
    movieId: movieObjectId,
    userId: req.user?._id,
  });
  if (!movieToDelte)
    return res
      .status(200)
      .json(new Apiresponse("Movie already delted or does not exist"));

  return res
    .status(200)
    .json(new Apiresponse("Movie delted successfully", 200, movieToDelte));
});

export { addUserMovie, getMovies, deleteUserMovie };
