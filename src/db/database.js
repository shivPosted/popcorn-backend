import mongoose from "mongoose";

const dbURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;
console.log(dbURI, dbName);

async function dbConnect() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connection to database succesfull");
    });

    const dbInstance = await mongoose.connect(`${dbURI}/${dbName}`);
    console.log(dbInstance.connections);
    return dbInstance;
  } catch (error) {
    console.error(error.message);
  }
}

export default dbConnect;
