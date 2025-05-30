import "dotenv/config.js";

import app from "./app.js";
import dbConnect from "./db/database.js";

const port = process.env.PORT;

dbConnect()
  .then(() => app.listen(port, () => console.log(`listening on port ${port}`)))
  .catch((err) => console.error(err.message));
