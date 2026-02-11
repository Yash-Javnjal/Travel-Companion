const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const TEST_USERS = [
  { username: 'testuser', email: 'test@example.com', password: 'password123' },
  { username: 'admin', email: 'admin@example.com', password: 'admin123' }
];

const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2MjM0NTY3ODl9.mock_signature_for_testing';

app.post('/api/login', (req, res) => {
  const { username, email, password } = req.body;
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


app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Login endpoint: POST http://localhost:${PORT}/api/login`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/api/health`);
});