import app from "./app.js";
console.log("Inside the index");

app.get("/", (req, res) => {
  return res.json("Hello from server");
});

const port = 8000;

app.listen(8000, (req, res) => {
  console.log(`Server listening on port ${port}`);
});
