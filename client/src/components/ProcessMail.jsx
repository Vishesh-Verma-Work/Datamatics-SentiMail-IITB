import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/processMail.css';
require("dotenv").config({ path: "../../.env" });

const ProcessMail = () => {
  const [emails, setEmails] = useState([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [unprocessedCount, setUnprocessedCount] = useState(0);
  const [apiInput, setApiInput] = useState([]);
  const [flagProc, setFlagProc] = useState(false);
  const [aiAns, setAiAns] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState('');

  useEffect(() => {
    getEmails();
  }, []);

  // Fetch emails from the server
  const getEmails = async () => {
    try {
      const response = await fetch("http://localhost:3000/getemails");
      const data = await response.json();
      setEmails(data);
      updateProcessedCount(data);

      // making subject, id, body api for the AI
      const fetchEmails = data.filter((email) => email.status === "fetch");

      const apiPayload = fetchEmails.map((email) => ({
        _id: email._id,
        subject: email.subject,
        body: email.body,
      }));

      setApiInput(apiPayload);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  const getPromptText = (apiInput) => {
    const apiInputStringified = JSON.stringify(apiInput);
    const escapedApiInput = apiInputStringified.replace(/\"/g, '\\"');

    const prompt = `Please process the following emails. For each email, analyze the subject and body, and strictly return the following details in a structured JSON format: - _id: The unique identifier of the email. - processedName: Extract the name(s) mentioned in the email (if any). If multiple names exist, return them in an array. If not present, set to null. - processedSentimentScore: Analyze the sentiment of the email body and return a score (in decimal from -1 which is bad to +1 which is good, use upto 3 digit after decimal ). If not determinable, set to null. - processedEmail: Extract the email address(es) mentioned in the email. If multiple exist, return them in an array. If not present, set to null. - processedPhone: Extract the phone number(s) mentioned in the email. If multiple exist, return them in an array. If not present, set to null. - processedOrderId: Extract the order ID mentioned in the email (if any). If not present, set to null. - processedTransactionId: Extract the transaction ID mentioned in the email (if any). If not present, set to null. - processedShortSummary: Provide a concise summary of the email content in one or two sentences. - processedFinalRequest: Extract the main request or action the user wants from the email. If not determinable, set to null. - processedLocation: Extract any location information mentioned in the email (e.g., city, address). If not present, set to null. - mailType: Categorize the email into one of the following predefined types based on its content: ['feedback', 'complaints', 'queries', 'supportRequests', 'appreciation', 'subscription/uns', 'others']. If no clear type can be determined, set it as 'others'. ### Rules for Processing: 1. The input emails will be provided as a JSON array. Each email object has the fields '_id', 'subject', and 'body'. 2. Use only the 'subject' and 'body' fields for analysis. Do not infer or assume any information beyond the provided text. 3. For fields that are not present or cannot be extracted, strictly set the value to **null**. 4. If a field can contain multiple values (e.g., names, emails, or phone numbers), return an **array**. Otherwise, return a single value. 5. For the 'mailType' field, ensure it is one of the predefined categories and do not introduce new types. 6. Only return the JSON output for all emails as a single JSON array. Do not include any explanations, commentary, or additional text outside of the JSON output. 7. If any input is invalid or cannot be processed, return an empty JSON array. ### Input: Email List: \`\`\`json${escapedApiInput}\`\`\` ### Expected Output: Return **only and strictly** the processed emails in JSON format based on the structure provided. Do not include any additional text or commentary.`;

    return prompt;
  };

  const updateProcessedCount = (emailList) => {
    const unprocessed = emailList.filter(
      (email) => email.status === "fetch"
    ).length;

    const processed = emailList.length - unprocessed;

    setProcessedCount(processed);
    setUnprocessedCount(unprocessed);
  };

  const triggerAI = () => {
    // Check if there are any emails with status 'fetch'
    if (unprocessedCount === 0) {
      alert("No mails to process.");
      return; // Prevent further execution if no unprocessed mails
    }

    setLoadingStatus('Fetching data...');
    const finalPrompt = getPromptText(apiInput);
    getProcessedDataByAI(finalPrompt);
  };

  const getProcessedDataByAI = async (finalPrompt) => {
    try {
      setLoadingStatus('AI is processing... Please wait!');
      const response = await axios({
        url: `${process.env.START_API_KEY}${process.env.API_KEY}`,
        method: "POST",
        data: {
          contents: [{ parts: [{ text: finalPrompt }] }],
        },
      });

      const rawResponse =
        response?.data?.candidates[0]?.content?.parts[0]?.text;

      const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();
      setAiAns(cleanedResponse);

      const temp = JSON.parse(cleanedResponse);
      setProcessedData(temp);

      await updateDatabase(temp);
      await getEmails();
      setLoadingStatus('Data successfully processed!');
    } catch (error) {
      setLoadingStatus('Error processing data.');
      console.error("Error fetching processed data:", error);
    }
  };

  const updateDatabase = async (processedData) => {
    try {
      const response = await axios({
        url: "http://localhost:3000/updateemails",
        method: "PUT",
        data: processedData,
      });

      if (response.status === 200) {
        alert("Processed data saved to the database successfully.");
      } else {
        console.error("Failed to update the database.");
      }
    } catch (err) {
      console.error("Error updating database:", err);
    }
  };

  return (
    <div className="process-mail-container">
      <div className="status-box">
        <p>Number of Fetched Emails: {unprocessedCount}</p>
        <p>Number of Processed Emails: {processedCount}</p>
        <p>Total Numbers of Emails: {emails.length}</p>
        <p className="loading-status">{loadingStatus}</p>
      </div>
      <div className="action-container">
        <button onClick={triggerAI} className="process-button">Process Unprocessed Mails</button>
        <pre>{aiAns || <p>Processing.....Please Wait</p>}</pre>
      </div>
    </div>
  );
};

export default ProcessMail;
