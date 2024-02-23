const PORT = process.env.PORT || 5000;

const NODE_ENV = process.env.NODE_ENV || "production";
const express = require("express");
const logger = require("./middleware/logger");
// const noChache = require("./middleware/no-cache");
const nocache = require("nocache")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

app.set("view engine", "pug");
app.use(logger);

app.use("/", require("./routes/pages"));

app.use(nocache());

app.use(express.static("public"));


app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode, go to http://localhost:${PORT}`);
})
