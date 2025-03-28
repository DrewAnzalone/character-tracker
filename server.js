// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const equipsRouter = require('./controllers/equips');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.json());
app.use(logger('dev'));
app.use(cors({ origin: ['https://character-tracker.netlify.app']}));
// app.use(cors({ origin: ['https://character-tracker.netlify.app', 'http://localhost:5173']}));

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/equips', equipsRouter);

// Start the server and listen on port 3000
const port = process.env.PORT ?? 3000; 
app.listen(port, () => {
  console.log('The express app is ready!');
});
