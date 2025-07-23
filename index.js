const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const webhookRoutes = require("./routes/webhook");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
