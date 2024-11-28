require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
app.use(express.json()); 
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const authorize = require('./googleApiAuthService');
const { listMessages } = require('./gmailApiServices'); 

const mongoose = require('mongoose');
const cors = require('cors');
const router = require("../routes/mailRoute");
const mailSchema = require("../models/mailModel");

app.use(cors()); 

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected with the backend!');
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on Port : ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  try {
    const authClient = await authorize();  // Use the authorize function to get OAuth2 client
    const emails = await listMessages(authClient);  // Fetch the latest emails
    return emails;
  } catch (error) {
    console.error("Error fetching emails: ", error);
    return [];
  }
}

app.get("/", (req, res) => {
  res.send("This is temp Frontend.");
});

app.get("/fetch", (req, res) => {
  res.send("Fetching the data by mail and storing into the database");
});

// Endpoint to fetch and display Gmail data in plain text
app.get("/pushemails", async (req, res) => {
  try {
    const emails = await main();  // Fetch emails using Gmail API
    let emailDataJson = [];  // Array to hold email data

    if (emails.length > 0) {
      // Use Promise.all for batch database insertion
      const insertPromises = emails.map(async (email) => {
        const fromMatch = email.from.match(/^(.*)<([^>]+)>$/);
        let mailName = "", mailEmail = "";

        if (fromMatch) {
          mailName = fromMatch[1].trim();  // Extract Name
          mailEmail = fromMatch[2].trim();  // Extract Email
        }

        // Create email object
        let emailJson = {
          messageId: email.messageId,
          threadId: email.threadId,
          from: email.from,
          mailName: mailName,
          mailEmail: mailEmail,
          to: email.to,
          cc: email.cc || "",  // Default to empty string if undefined
          subject: email.subject,
          date: email.date,
          filename: email.filename || "",  // Default to empty string if undefined
          labels: email.labels || [],
          body: email.body || "",  // Default to empty string if undefined
        };

        // Push the email data into the response JSON array
        emailDataJson.push(emailJson);

        // Insert email into the database
        await mailSchema.create({
          messageId: email.messageId,
          threadId: email.threadId,
          from: email.from,
          mailName: mailName,
          mailEmail: mailEmail,
          to: email.to,
          cc: email.cc,
          subject: email.subject,
          mailDate: email.date,
          fileName: email.filename,
          labels: email.labels,
          body: email.body,
        });

        console.log("Data Pushed to the Database Successfully");
      });

      // Wait for all insertions to complete
      await Promise.all(insertPromises);
      
    } else {
      emailDataJson.push({ message: 'No emails found.' });
    }

    res.status(201).json(emailDataJson);
  } catch (error) {
    res.send("All Data is Pushed in the DataBase");
  }
});



app.get("/getemails", async (req,res)=>{
  try{
    const data = await mailSchema.find();
  res.status(201).json(data);
  }catch(err){
    console.log(err);
  }
})



app.put("/updateemails", async (req, res) => {
  try {
    const updates = req.body; 

    for (const update of updates) {
      const {
        _id,
        processedName,
        processedSentimentScore,
        processedEmail,
        processedPhone,
        processedOrderId,
        processedTransactionId,
        processedCustomerId,
        processedShortSummary,
        processedFinalRequest,
        processedLocation,
        mailType,
      } = update; // Destructure update fields

      await mailSchema.findByIdAndUpdate(_id, {
        $set: {
          processedName,
          processedSentimentScore,
          processedEmail,
          processedPhone,
          processedOrderId,
          processedTransactionId,
          processedCustomerId,
          processedShortSummary,
          processedFinalRequest,
          processedLocation,
          mailType,
          status: "processed", 
        },
      });
    }

    res.status(200).json({ message: "Emails updated successfully!" });
  } catch (err) {
    console.error("Error updating emails:", err);
    res.status(500).json({ message: "Error updating emails.", error: err });
  }
});




