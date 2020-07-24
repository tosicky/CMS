const express = require("express");
require("./db/mongoose");

const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const memberRoutes = require("./routers/members");
const donationRoutes = require("./routers/donations");
const miscRoutes = require("./routers/misc");

const app = express();

// Define paths for Express config
const pubilcDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("ifnotEquals", function (arg1, arg2, options) {
  return arg1 != arg2 ? options.fn(this) : options.inverse(this);
});

// Setup static directory to serve
app.use(express.static(pubilcDirPath));

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("_method"));
app.use(donationRoutes);
app.use(memberRoutes);
app.use(miscRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    title: "Church Managemet System",
  });
});

app.get("/adminboard", (req, res) => {
  res.render("adminboard", {
    title: "Admin Board",
  });
});

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});
