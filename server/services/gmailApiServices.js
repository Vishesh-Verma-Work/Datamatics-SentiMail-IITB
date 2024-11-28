const { google } = require('googleapis');

// Function to list all emails with pagination
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  
  let allEmails = [];
  let pageToken = null;

  try {
    do {
      // Fetch emails in batches (maxResults set to 100 per request)
      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100,  
        pageToken: pageToken,  
      });

      const messages = res.data.messages || [];

      // Process and extract email details
      const emailData = await Promise.all(
        messages.map(async (message) => {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          // Extract headers and basic info
          const headers = msg.data.payload.headers;
          const from = getHeaderValue(headers, 'From');
          const to = getHeaderValue(headers, 'To');
          const cc = getHeaderValue(headers, 'Cc');
          const date = getHeaderValue(headers, 'Date');
          const messageId = getHeaderValue(headers, 'Message-ID');
          const threadId = msg.data.threadId;
          const subject = getHeaderValue(headers, 'Subject');
          const filename = getAttachmentFilename(msg.data.payload.parts || []);
          const labels = msg.data.labelIds || [];

          // Extract the email body
          const body = await getEmailBody(msg.data.payload);

          return {
            from,
            to,
            cc,
            date,
            messageId,
            threadId,
            subject,
            filename,
            labels,
            body,
          };
        })
      );

      // Add the fetched emails to the allEmails array
      allEmails = allEmails.concat(emailData);

      // Update pageToken for the next request, or set it to null if no more pages
      pageToken = res.data.nextPageToken;

      console.log(`Fetched ${allEmails.length} emails so far...`);
    } while (pageToken);  // Continue until no more pages

    return allEmails; // Return all fetched emails

  } catch (error) {
    console.error('Error fetching emails: ', error);
    return [];
  }
}

// Helper function to get header value by name
function getHeaderValue(headers, name) {
  const header = headers.find((header) => header.name === name);
  return header ? header.value : null;
}

// Function to get the email body
async function getEmailBody(payload) {
  let body = '';

  // Helper function to traverse parts recursively
  const traverseParts = (parts) => {
    for (const part of parts) {
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        if (part.body && part.body.data) {
          body = decodeBase64(part.body.data); // Decode the content
          break; // Stop once we find the body
        }
      }
      // If the part has nested parts, traverse them
      if (part.parts) {
        traverseParts(part.parts);
      }
    }
  };

  // Check if the payload has a body directly
  if (payload.body && payload.body.data) {
    body = decodeBase64(payload.body.data);
  }

  // Traverse parts if available
  if (payload.parts) {
    traverseParts(payload.parts);
  }

  return body || 'No content found'; // Return the body or a fallback message
}

// Helper function to decode base64 content
function decodeBase64(base64) {
  if (!base64) return '';
  const base64Url = base64.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(base64Url, 'base64');
  return buffer.toString('utf8');
}

// Function to extract the filename from attachments
function getAttachmentFilename(parts) {
  for (const part of parts) {
    if (part.filename) {
      return part.filename;
    }
  }
  return null; // Return null if no attachments
}


module.exports = { listMessages };
