const express = require("express");
const router = express.Router();
const {
  verifyWebhook,
  receiveWebhook,
} = require("../controllers/facebookController");

router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveWebhook);

module.exports = router;
