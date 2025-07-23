const axios = require("axios");
const { appendToGoogleSheet } = require("../services/googleSheetsService");

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};

const receiveWebhook = async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field === "leadgen") {
          const leadId = change.value.leadgen_id;

          try {
            const response = await axios.get(
              `https://graph.facebook.com/v18.0/${leadId}?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`
            );

            const fields = response.data.field_data;
            const formatted = fields.map((f) => f.values.join(", "));
            await appendToGoogleSheet(formatted);
            console.log("✅ Lead data saved to Google Sheet");
          } catch (error) {
            console.error(" Error fetching lead data:", error.response?.data || error.message);
          }
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

module.exports = { verifyWebhook, receiveWebhook };
