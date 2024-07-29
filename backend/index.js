const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Temporary storage for registered users
const users = [];
const borrowList = [];

// Secret key for JWT
const secretKey = 'your-secret-key';

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

app.get("/",(req,res)=>res.json({msg:"hello welcome to library"}))

// Signup route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if the email is already taken
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ message: 'email is already taken' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Error occurred while hashing password' });
    }

    // Store the new user
    users.push({ email, password: hash });

    res.status(201).json({ message: 'User created successfully' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find(user => user.email === email);

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare the provided password with the stored hash
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ token });
  });
});

// Protected route (borrow book)
app.post('/borrow', authenticateToken, (req, res) => {
  // Process borrowing logic here
  const { book,name, email } = req.body;
  borrowList.push({ book,name, email })
  res.json({ message: 'Book borrowed successfully' });
});

// Middleware for authenticating JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
