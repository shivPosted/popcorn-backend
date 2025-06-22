import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    runtime: {
      type: Number,
      requrired: true,
    },
    imdbRating: {
      type: Number,
      requried: true,
    },
    imdbId: {
      type: String,
      requried: true,
      unique: true,
    },
    userRating: {
      type: Number,
      requried: true,
    },
    poster: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
