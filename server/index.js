import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();

import medicalRouter from './routes/medicalData.js';
import router from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/medicalData', medicalRouter);
app.use('/', router);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
