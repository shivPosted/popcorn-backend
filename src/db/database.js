import mongoose from "mongoose";

const dbURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

async function dbConnect() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connection to database succesfull");
    });

    await mongoose.connect(`${dbURI}/${dbName}`);
  } catch (error) {
    console.error(error.message);
  }
}

export default dbConnect;
