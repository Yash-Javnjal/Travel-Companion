// ============================================
// MINIMAL EXPRESS.JS LOGIN SERVER FOR TESTING
// ============================================

// Import Express - the web framework for Node.js
const express = require('express');

// Create an Express application instance
const app = express();

// Define the port where our server will listen
const PORT = 3000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// This middleware parses incoming JSON requests
// Without this, req.body would be undefined
app.use(express.json());

// ============================================
// HARDCODED TEST CREDENTIALS
// ============================================

// In a real app, these would come from a database
// For testing purposes, we use hardcoded values
const TEST_USERS = [
  { username: 'testuser', email: 'test@example.com', password: 'password123' },
  { username: 'admin', email: 'admin@example.com', password: 'admin123' }
];

// Mock JWT token (in real apps, use jsonwebtoken library)
const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2MjM0NTY3ODl9.mock_signature_for_testing';

// ============================================
// LOGIN ENDPOINT
// ============================================

// POST /api/login - Handles user login
app.post('/api/login', (req, res) => {
  
  // Extract credentials from request body
  const { username, email, password } = req.body;

  // ---- VALIDATION: Check if required fields exist ----
  
  // User must provide either username or email
  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username or email'
    });
  }

  // Password is always required
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide password'
    });
  }

  // ---- AUTHENTICATION: Check credentials ----
  
  // Find user by username or email
  const user = TEST_USERS.find(u => 
    (username && u.username === username) || 
    (email && u.email === email)
  );

  // Check if user exists
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if password matches
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid password'
    });
  }

  // ---- SUCCESS: Return token ----
  
  // Login successful - return mock JWT token
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token: MOCK_JWT_TOKEN,
      user: {
        username: user.username,
        email: user.email
      }
    }
  });
});

// ============================================
// HEALTH CHECK ENDPOINT (Optional but useful)
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// ============================================
// START THE SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Login endpoint: POST http://localhost:${PORT}/api/login`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/api/health`);
});