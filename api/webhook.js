const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
const router = express.Router();

 


router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook Verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.use("/api", router);  

module.exports = serverless(app);
