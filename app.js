const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://ho:yUaWyeDwbXcIOpNl@cluster0-voj2r.mongodb.net/internet-banking";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const customerRoutes = require("./routes/customer");
const deptReminderRoutes = require("./routes/deptReminder");
const paymentRoutes = require('./routes/payment');

app.use(customerRoutes, deptReminderRoutes, paymentRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => console(err));
