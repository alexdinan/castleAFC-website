
const path = require("path");
const app = require(path.join(__dirname, "app.js"));

const HOSTNAME = "127.0.0.1";
const PORT = "8090";

app.listen(PORT, HOSTNAME);
