const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Life RPG backend is running");
});

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`Life RPG backend listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the Life RPG backend:", error.message);
  process.exit(1);
});
