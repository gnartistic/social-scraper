import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OUTPUT_FILE = path.join(process.cwd(), "tweets.json");

app.use(cors());
app.use(express.json());

// **Retrieve stored tweets & comments**
app.get("/tweets", (req, res) => {
  if (fs.existsSync(OUTPUT_FILE)) {
    const tweets = JSON.parse(fs.readFileSync(OUTPUT_FILE));
    res.json(tweets);
  } else {
    res.status(404).json({ message: "No tweets available." });
  }
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});