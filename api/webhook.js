const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const router = express.Router();

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.use("/api", router);

module.exports = serverless(app);
