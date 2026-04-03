const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Docker App this app the best of the world and we get the better version of the app  🚀");
});

app.listen(3000, '0.0.0.0', () => {console.log("App running on port 3000")});