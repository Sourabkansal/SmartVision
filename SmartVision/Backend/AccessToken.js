import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration (you might want to move these to a config file)
const ZOHO_TOKEN_URL = process.env.ZOHO_TOKEN_URL;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

let currentAccessToken = null;


async function fetchAccessToken() {
  try {
    const url = `${ZOHO_TOKEN_URL}?grant_type=refresh_token&client_id=${ZOHO_CLIENT_ID}&client_secret=${ZOHO_CLIENT_SECRET}&redirect_uri=${ZOHO_REDIRECT_URI}&refresh_token=${ZOHO_REFRESH_TOKEN}`;
   
    const response = await axios.post(url);
    console.log(response.data);
    if (response.data?.access_token) {
      currentAccessToken = response.data.access_token;
      console.log(`New access token generated at ${new Date().toISOString()}`);
      return currentAccessToken;
    }
    throw new Error("Access token not found in the response");
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw error;
  }
}

function initTokenRefresh() {
  cron.schedule('*/6 * * * *', async () => {
    try {
      await fetchAccessToken();
    } catch (error) {
      console.error("Failed to refresh token:", error.message);
    }
  });
}

function getAccessToken() {
  return currentAccessToken;
}

export {
  initTokenRefresh,
  fetchAccessToken,
  getAccessToken
};