// server.js
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

// Middleware to parse request bodies and cookies
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Add your own database string here 
    await mongoose.connect('mongodb+srv://demo:*****@3dviewer.fs33ycy.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

import userRouter from './routes/user.route.js';
app.use('/users', userRouter);

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Authentication endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve the user from the database based on the username
    const user = await user.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: 'Username not found.' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // If authentication is successful, generate a token
      const token = jwt.sign({ username }, 'secretKey', { expiresIn: '24h' });

      // Return the token as a response
      return res.json({ success: true, message: 'User authenticated successfully.', token });
    } else {
      return res.json({ success: false, message: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    return res.json({ success: false, message: 'Error occurred during login.' });
  }
});


// Protected route example
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.send('Welcome to the dashboard');
});

// Start the server and connect to the database
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

startServer();
