import mongoose, { Schema } from "mongoose";
const ratingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    userRating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
