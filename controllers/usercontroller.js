// controllers/user.controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.schema.js';

// Function to sign up a new user
async function signUp(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists.' });
    }

    // Generate a salt to hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      username,
      password: hashedPassword
    });

    if (req.file) {
      newUser.profilePicture = req.file.path;
    }

    // Save the new user to the database
    await newUser.save();
    return res.json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error occurred during sign-up:', error);
    return res.json({ success: false, message: 'Error occurred during sign-up.' });
  }
}

// Function to sign in a user
async function signIn(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the username exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: 'Username not found.' });
    }

    // Compare the provided password with thehashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, message: 'Incorrect password.' });
    }

    // Generate a token
    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '24h' });

    // Update the user's session
    user.session = {
      token,
      expiration: new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours from now
    };

    await user.save();
    res.render('profile');
    return res.json({ success: true, message: 'User logged in successfully.', token });
  } catch (error) {
    console.error('Error occurred during sign-in:', error);
    return res.json({ success: false, message: 'Error occurred during sign-in.' });
  }
}

// Function to sign out a user
async function signOut(req, res) {
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  try {
    // Find the user in the database based on the session token
    const user = await User.findOne({ 'session.token': token });

    // Clear the session token and expiration time for the user
    user.session.token = '';
    user.session.expiration = '';
    await user.save();
    res.render('index');
    return res.json({ success: true, message: 'User logged out successfully.' });
  } catch (error) {
    console.error('Error occurred during sign-out:', error);
    return res.json({ success: false, message: 'Error occurred during sign-out.' });
  }
}

// Function to get user profile
async function getProfile(req, res) {
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  try {
    const decoded = jwt.verify(token, 'secretKey');
    const username = decoded.username;

    // Find the user in the database based on the username
    const user = await User.findOne({ username });

    // Retrieve the user's profile picture
    const profilePicture = user.profilePicture;

    // Return the profile picture file
    res.render('profile');
    res.sendFile(user);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Function to handle file upload
async function uploadFile(req, res) {
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  try {
    const decoded = jwt.verify(token, 'secretKey');
    const username = decoded.username;

    // Find the user in the database based on the username
    const user = await User.findOne({ username });

    // Handle the file upload logic
    // Access the uploaded file using req.file
    // Process the file as per your requirements

    res.json({ success: true, message: 'File uploaded successfully.' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
} 

export default {
  signUp,
  signIn,
  signOut,
  getProfile,
  uploadFile
};
