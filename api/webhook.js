const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const router = express.Router();

// Facebook GET webhook verification
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

// Facebook POST - leads data
router.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      for (const change of entry.changes || []) {
        if (change.field === "leadgen") {
          const leadId = change.value.leadgen_id;
          console.log("🔔 New lead ID:", leadId);
          // You can later fetch & send to Google Sheet here
        }
      }
    }
    return res.status(200).send("EVENT_RECEIVED");
  }
  return res.sendStatus(404);
});

app.use("/api", router); // required for Vercel serverless functions

module.exports = serverless(app);
