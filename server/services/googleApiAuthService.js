//googleApiAuthService.js
const fs = require('fs').promises;
const path = require('path');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly'  // Added read-only scope to fetch email contents
];

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URIS = process.env.REDIRECT_URIS;
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/credentials.json'); // Correct path
const TOKEN_PATH = path.join(__dirname, '../credentials/token.json'); // Token file path

/**
 * Reads previously authorized credentials from the saved file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS[0]);
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

module.exports = authorize;
