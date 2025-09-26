import express from 'express';
import bodyParser from 'body-parser';   
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
console.log("ZOHO_CLIENT_ID",process.env.ZOHO_CLIENT_ID);

import { initTokenRefresh, getAccessToken, fetchAccessToken } from './AccessToken.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Function to generate next MIR number
function generateNextMIRNo(currentMIRNo) {
  // Extract number from MIR format (e.g., "MR0092" -> 92)
  const match = currentMIRNo.match(/MR(\d+)/);
  if (match) {
    const currentNumber = parseInt(match[1]);
    const nextNumber = currentNumber + 1;
    // Format with leading zeros (4 digits)
    return `MR${nextNumber.toString().padStart(4, '0')}`;
  }
  // Fallback if format doesn't match
  return "MR0001";
}

async function startServer() {
  try {
    // Try to initialize Zoho token, but don't fail if env vars are missing
    try {
      initTokenRefresh();
      await fetchAccessToken();
      console.log('Access token initialized');
    } catch (tokenError) {
      console.warn('Zoho token initialization failed:', tokenError.message);
      console.warn('Server will start without Zoho integration. Please configure .env file for full functionality.');
    }

    const getLatestMIR = async (req, res) => {
      try {
        const token = getAccessToken();
        if (!token) {
          return res.status(401).json({ error: "Access token not available" });
        }

        // Fetch latest MIR records from Zoho
        const response = await fetch(`https://www.zohoapis.com/creator/v2.1/data/smartvisionforinformationsys/e-procurement-/report/Create_MIR_Report`, {
          method: 'GET',
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log('Zoho MIR Report response:', data);

        // Find the highest MIR_No
        let highestMIRNo = "MR0000";
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach(record => {
            if (record.MIR_No && record.MIR_No > highestMIRNo) {
              highestMIRNo = record.MIR_No;
            }
          });
        }

        // Generate next MIR_No
        const nextMIRNo = generateNextMIRNo(highestMIRNo);
        
        res.json({ 
          success: true, 
          latestMIR: highestMIRNo,
          nextMIR: nextMIRNo,
          data: data 
        });
      } catch (error) {
        console.error('Error fetching MIR data:', error);
        res.status(500).json({ error: error.message });
      }
    };

    const setApiData = async (req, res) => {
      console.log("Incoming request body:", req.body);

      try {
        const token = getAccessToken();
        if (!token) {
          console.log('No access token available, returning mock response');
          // Return mock success response when no token is available
          return res.json({ 
            success: true, 
            message: "Form data received (mock response - Zoho integration not configured)",
            data: req.body 
          });
        }
       
        const payload = req.body;

        // Send data to Zoho CRM
        const response = await fetch(`https://www.zohoapis.com/creator/v2.1/data/smartvisionforinformationsys/e-procurement-/form/Create_MIR`, {
          method: 'POST',
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        console.log('Zoho Creator response:', data);

        res.json({ success: true, data });
      } catch (error) {
        console.error('Error sending data to Zoho:', error);
        res.status(500).json({ error: error.message });
      }
    };

    app.get('/get-latest-mir', getLatestMIR);
    app.post('/set-data', setApiData);

    app.get('/', (req, res) => {
      res.send('Smart vesion Backend API is running!');
    });
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Note: Create .env file with Zoho credentials for full integration');
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
  }
}

startServer();