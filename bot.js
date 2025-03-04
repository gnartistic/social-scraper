import { scrapeTweets } from "./scraper.js";
import { generateComment } from "./generateComment.js";
import fs from "fs";
import path from "path";
import cron from "node-cron";

const OUTPUT_FILE = path.join(process.cwd(), "tweets.json");

const generateTweetData = async () => {
  console.log("🔍 Scraping tweets...");
  const tweets = await scrapeTweets();

  if (tweets.length === 0) {
    console.log("⚠️ No tweets found.");
    return;
  }

  console.log("💬 Generating comments...");
  const tweetsWithComments = [];

  for (const { text, url } of tweets) {
    console.log(`Tweet: ${text}`);
    console.log(`URL: ${url}`);

    const comment = await generateComment(text);
    console.log(`Generated Comment: ${comment}`);

    tweetsWithComments.push({ text, url, comment });
  }

  // Save to a JSON file for frontend use
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tweetsWithComments, null, 2));
  console.log(`✅ Saved ${tweetsWithComments.length} tweets with comments.`);
};

// **Run every 30 minutes to update tweets**
cron.schedule("*/30 * * * *", generateTweetData);
console.log("🤖 Tweet scraping bot is running...");

// **Run immediately on startup**
generateTweetData();
