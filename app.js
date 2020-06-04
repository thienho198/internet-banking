const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const customerRoutes = require('./routes/customer');
const deptReminderRoutes = require('./routes/deptReminder');
const paymentRoutes = require('./routes/payment');
const bankRoutes = require('./routes/bank');

app.use(customerRoutes, deptReminderRoutes, paymentRoutes, bankRoutes);
connectDB();
app.listen(3000);
