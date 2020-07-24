const mongoose = require("mongoose");

const db_url = "mongodb://127.0.0.1:27017/church-management-system";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
