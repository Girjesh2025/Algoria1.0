import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configure CORS
app.use(cors());
app.use(express.json());

// Path to token file
const tokenFilePath = path.join(__dirname, 'access_token.txt');

// Endpoint to launch the Python login script
app.get('/api/token-server/launch-login-tool', (req, res) => {
  try {
    // Using Python to run the login GUI script
    // Note: In a real app, you'd check if Python is installed first
    const pythonPath = 'python'; // or 'python3' depending on your system
    const scriptPath = path.join(__dirname, 'login_gui_new.py');
    
    // Check if the script exists
    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Login script not found. Please check your installation.' 
      });
    }
    
    // Execute the script
    const loginProcess = exec(`${pythonPath} "${scriptPath}"`, (error) => {
      if (error) {
        console.error('Error executing login script:', error);
      }
    });
    
    // Log process output for debugging
    loginProcess.stdout.on('data', (data) => {
      console.log(`Login script output: ${data}`);
    });
    
    loginProcess.stderr.on('data', (data) => {
      console.error(`Login script error: ${data}`);
    });
    
    return res.json({ success: true, message: 'Login tool launched successfully' });
  } catch (error) {
    console.error('Error launching login tool:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to launch login tool: ' + (error.message || 'Unknown error') 
    });
  }
});

// Endpoint to check if the token file exists and read its content
app.get('/api/token-server/check-token', (req, res) => {
  try {
    if (fs.existsSync(tokenFilePath)) {
      const token = fs.readFileSync(tokenFilePath, 'utf8').trim();
      if (token) {
        return res.json({ token });
      }
    }
    return res.json({ token: null });
  } catch (error) {
    console.error('Error checking token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to check token: ' + (error.message || 'Unknown error') 
    });
  }
});

// Endpoint to create a temporary token for testing (only in development)
app.post('/api/token-server/create-test-token', (req, res) => {
  // This should only be used for development and testing
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token is required' 
    });
  }
  
  try {
    fs.writeFileSync(tokenFilePath, token);
    return res.json({ 
      success: true, 
      message: 'Test token created successfully' 
    });
  } catch (error) {
    console.error('Error creating test token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create test token: ' + (error.message || 'Unknown error') 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
}); 