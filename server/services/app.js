require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
app.use(express.json()); 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const authorize = require('./googleApiAuthService');
const { listMessages } = require('./gmailApiServices'); 

const mongoose = require("mongoose");
const cors = require('cors');
const router = require('../routes/mailRoute');
const mailSchema = require('../models/mailModel');

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
    console.error('Error fetching emails: ', error);
    return [];
  }
}




// Endpoint to fetch and display Gmail data in plain text
app.get('/pushemails', async (req, res) => {
  try {
    const emails = await main();  // Fetch emails using Gmail API
    let emailDataJson = [];  // Array to hold email data

    if (emails.length > 0) {
      // Use Promise.all for batch database insertion
      const insertPromises = emails.map(async (email) => {
        const fromMatch = email.from.match(/^(.*)<([^>]+)>$/);
        let mailName = '', mailEmail = '';

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
          cc: email.cc || '',  // Default to empty string if undefined
          subject: email.subject,
          date: email.date,
          filename: email.filename || '',  // Default to empty string if undefined
          labels: email.labels || [],
          body: email.body || '',  // Default to empty string if undefined
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

        console.log('Data Pushed to the Database Successfully');
      });

      // Wait for all insertions to complete
      await Promise.all(insertPromises);
      
    } else {
      emailDataJson.push({ message: 'No emails found.' });
    }

    res.status(201).json(emailDataJson);
  } catch (error) {
    res.send('All Data is Pushed in the DataBase');
  }
});


app.get('/getemails', async (req,res)=>{
  try{
    const data = await mailSchema.find();
    // const j = await mailSchema.find({mailType : "fetched"})
    // const k = j.json();
    // console.log(k);
  res.status(201).json(data);
  }catch(err){
    console.log(err);
  }
})


app.put('/updateemails', async (req, res) => {
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
          status: 'processed', 
        },
      });
    }

    res.status(200).json({ message: 'Emails updated successfully!' });
  } catch (err) {
    console.error('Error updating emails:', err);
    res.status(500).json({ message: 'Error updating emails.', error: err });
  }
});



app.get('/countheader', async (req, res) => {
  try {
    const mails = await mailSchema.find().select('mailType');

    let feedback = 0;
    let complaints = 0;
    let queries = 0;
    let supportRequests = 0;
    let appreciation = 0;
    let subUns = 0;
    let others = 0;

    for (const mail of mails) {
      if (mail.mailType === 'feedback') feedback++;
      else if (mail.mailType === 'complaints') complaints++;
      else if (mail.mailType === 'queries') queries++;
      else if (mail.mailType === 'supportRequests') supportRequests++;
      else if (mail.mailType === 'appreciation') appreciation++;
      else if (mail.mailType === 'subscription/uns') subUns++;
      else if (mail.mailType === 'others') others++;
    }

    const totalMails = mails.length;

    res.status(201).json({
      totalMails,
      feedback,
      complaints,
      queries,
      supportRequests,
      appreciation,
      subUns,
      others,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/feedback', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'feedback',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/complaints', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'complaints',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/queries', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'queries',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/supportRequests', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'supportRequests',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/appreciation', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'appreciation',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/subscription', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'subscription/uns',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})
app.get('/others', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      mailType: 'others',
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})


app.get('/allprocessed', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      status: 'processed'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
  }catch(e){
    console.log(e);
  }
})

app.get('/dashboard/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const IDdata = await mailSchema.findById(id); 

    if (!IDdata) {
      return res.status(404).json({ error: 'Data not found' }); 
    }

    res.status(200).json(IDdata); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

app.get('/getsentiments', async (req,res)=>{
  try{
    const data = await mailSchema.find().select('processedSentimentScore');
    res.status(201).json(data);
  }catch(e){
    console.log(e);
  }
});


app.get('/fetcheddatajusttrying', async (req,res)=>{
  try{
    const feedbackData = await mailSchema.find({
      status: 'fetched'
    }).sort({ mailDate: -1 });
    res.status(201).json(feedbackData);
    console.log(feedbackData);
  }catch(e){
    console.log(e);
  }
})




app.post('/233453s', async (req, res) => {
  try {
    // Sample data to insert
    const data = [
      {
        from: 'Priya Singh <priya.singh@gmail.com>',
        mailName: 'Priya Singh',
        mailEmail: 'priya.singh@gmail.com',
        subject: 'Damaged Product Received - Order #123456',
        body: `Dear Customer Support,\n\nI am writing to report that the blender I ordered under Order #123456 arrived damaged. The jar is cracked, and the motor does not start.\n\nOrder ID: #123456\nTransaction ID: TX001234\nCustomer ID: 101010\nContact: 9876543210\nLocation: Mumbai\n\nPlease arrange for a replacement or initiate a refund for this defective item.\n\nThank you,\nPriya Singh`,
        mailDate: 'Fri, 29 Nov 2024 12:00:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Priya Singh'],
        processedSentimentScore: -0.4,
        processedEmail: ['priya.singh@gmail.com'],
        processedPhone: ['9876543210'],
        processedOrderId: ['123456'],
        processedTransactionId: ['TX001234'],
        processedShortSummary: 'Customer Priya Singh reports receiving a damaged blender under Order #123456 and requests a replacement or refund.',
        processedFinalRequest: 'replacement or refund',
        processedLocation: 'Mumbai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: 'Ramesh Yadav <ramesh.yadav@gmail.com>',
        mailName: 'Ramesh Yadav',
        mailEmail: 'ramesh.yadav@gmail.com',
        subject: 'Missing Items in Order - Order #987654',
        body: `Dear Team,\n\nMy recent order #987654 is missing two items: a power bank and a charging cable. The invoice lists them as delivered.\n\nOrder ID: #987654\nTransaction ID: TX098765\nCustomer ID: 202020\nContact: 9123456789\nLocation: Delhi\n\nPlease send the missing items or provide a refund for them.\n\nRegards,\nRamesh Yadav`,
        mailDate: 'Thu, 28 Nov 2024 10:15:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Ramesh Yadav'],
        processedSentimentScore: -0.3,
        processedEmail: ['ramesh.yadav@gmail.com'],
        processedPhone: ['9123456789'],
        processedOrderId: ['987654'],
        processedTransactionId: ['TX098765'],
        processedShortSummary: 'Customer Ramesh Yadav reports missing items in Order #987654 and requests a resolution.',
        processedFinalRequest: 'replacement or refund',
        processedLocation: 'Delhi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: 'Deepika Rao <deepika.rao@gmail.com>',
        mailName: 'Deepika Rao',
        mailEmail: 'deepika.rao@gmail.com',
        subject: 'Refund Not Processed - Order #456789',
        body: `Dear Support Team,\n\nIt has been two weeks since I returned the defective microwave (Order #456789), but I haven’t received my refund yet.\n\nOrder ID: #456789\nTransaction ID: TX123456\nCustomer ID: 303030\nContact: 9812345678\nLocation: Bangalore\n\nPlease expedite the refund process and confirm the timeline.\n\nThank you,\nDeepika Rao`,
        mailDate: 'Wed, 27 Nov 2024 14:00:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Deepika Rao'],
        processedSentimentScore: -0.35,
        processedEmail: ['deepika.rao@gmail.com'],
        processedPhone: ['9812345678'],
        processedOrderId: ['456789'],
        processedTransactionId: ['TX123456'],
        processedShortSummary: 'Customer Deepika Rao reports a delayed refund for Order #456789 and requests an update.',
        processedFinalRequest: 'refund confirmation',
        processedLocation: 'Bangalore',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: 'Amit Kumar <amit.kumar@gmail.com>',
        mailName: 'Amit Kumar',
        mailEmail: 'amit.kumar@gmail.com',
        subject: 'Delivery Delay - Order #654321',
        body: `Dear Customer Care,\n\nMy order #654321 was supposed to arrive last week, but it has still not been delivered. The tracking status shows 'In Transit.'\n\nOrder ID: #654321\nTransaction ID: TX654321\nCustomer ID: 404040\nContact: 9871234567\nLocation: Kolkata\n\nPlease update me on the delivery status.\n\nThanks,\nAmit Kumar`,
        mailDate: 'Tue, 26 Nov 2024 16:00:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Amit Kumar'],
        processedSentimentScore: -0.3,
        processedEmail: ['amit.kumar@gmail.com'],
        processedPhone: ['9871234567'],
        processedOrderId: ['654321'],
        processedTransactionId: ['TX654321'],
        processedShortSummary: 'Customer Amit Kumar reports a delivery delay for Order #654321 and requests an update.',
        processedFinalRequest: 'delivery update',
        processedLocation: 'Kolkata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: 'Sneha Patel <sneha.patel@gmail.com>',
        mailName: 'Sneha Patel',
        mailEmail: 'sneha.patel@gmail.com',
        subject: 'Faulty Item Received - Order #777888',
        body: `Dear Team,\n\nThe mobile charger I received under Order #777888 is faulty. It doesn’t charge any device.\n\nOrder ID: #777888\nTransaction ID: TX777888\nCustomer ID: 505050\nContact: 9823456789\nLocation: Pune\n\nPlease send a replacement as soon as possible.\n\nBest regards,\nSneha Patel`,
        mailDate: 'Mon, 25 Nov 2024 11:30:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Sneha Patel'],
        processedSentimentScore: -0.3,
        processedEmail: ['sneha.patel@gmail.com'],
        processedPhone: ['9823456789'],
        processedOrderId: ['777888'],
        processedTransactionId: ['TX777888'],
        processedShortSummary: 'Customer Sneha Patel reports receiving a faulty mobile charger under Order #777888 and requests a replacement.',
        processedFinalRequest: 'replacement',
        processedLocation: 'Pune',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: 'Ankit Jain <ankit.jain@gmail.com>',
        mailName: 'Ankit Jain',
        mailEmail: 'ankit.jain@gmail.com',
        subject: 'Incorrect Billing Amount - Order #333444',
        body: `Dear Support,\n\nThe invoice for my Order #333444 shows an overcharged amount of Rs. 2,000 instead of Rs. 1,500. Kindly correct this.\n\nOrder ID: #333444\nTransaction ID: TX333444\nCustomer ID: 606060\nContact: 9801234567\nLocation: Jaipur\n\nPlease rectify the bill and process the refund for the extra amount.\n\nThanks,\nAnkit Jain`,
        mailDate: 'Sun, 24 Nov 2024 10:00:00 +0530',
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Ankit Jain'],
        processedSentimentScore: -0.3,
        processedEmail: ['ankit.jain@gmail.com'],
        processedPhone: ['9801234567'],
        processedOrderId: ['333444'],
        processedTransactionId: ['TX333444'],
        processedShortSummary: 'Customer Ankit Jain reports an overcharged invoice for Order #333444 and requests a correction.',
        processedFinalRequest: 'refund correction',
        processedLocation: 'Jaipur',
        createdAt: new Date(),
        updatedAt: new Date()
      }  
    ];
 
    const result = await mailSchema.insertMany(data);

    res.status(201).json({
      message: `${result.length} documents inserted successfully.`,
      data: result,
    });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Failed to insert data.' });
  }
});


app.post('/insertmanydata2', async (req, res) => {
  try {
    // Sample data to insert
    const data = [
      {
        messageId: 'unique-message-id',
        threadId: 'unique-thread-id',
        from: 'Priya Singh <priya.singh@gmail.com>',
        mailName: 'Priya Singh',
        mailEmail: 'priya.singh@gmail.com',
        subject: 'Damaged Product Received - Order #123456',
        body: `Dear Customer Support,\n\nI am writing to report that the blender I ordered under Order #123456 arrived damaged. The jar is cracked, and the motor does not start.\n\nOrder ID: #123456\nTransaction ID: TX001234\nCustomer ID: 101010\nContact: 9876543210\nLocation: Mumbai\n\nPlease arrange for a replacement or initiate a refund for this defective item.\n\nThank you,\nPriya Singh`,
        mailDate: new Date('2024-11-29T06:30:00.000Z'), // Use Date object
        labels: ['CATEGORY_PERSONAL', 'INBOX'],
        status: 'processed',
        mailType: 'complaints',
        processedName: ['Priya Singh'],
        processedSentimentScore: -0.4,
        processedEmail: ['priya.singh@gmail.com'],
        processedPhone: ['9876543210'],
        processedOrderId: ['123456'],
        processedTransactionId: ['TX001234'],
        processedShortSummary:
          'Customer Priya Singh reports receiving a damaged blender under Order #123456 and requests a replacement or refund.',
        processedFinalRequest: 'replacement or refund',
        processedLocation: 'Mumbai',
      }  
    ];
 
    const result = await mailSchema.insertMany(data);

    res.status(201).json({
      message: `${result.length} documents inserted successfully.`,
      data: result,
    });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Failed to insert data.' });
  }
});


let maalMasala = [
  
  {
    from: 'Priya Singh <priya.singh@gmail.com>',
    mailName: 'Priya Singh',
    mailEmail: 'priya.singh@gmail.com',
    subject: 'Damaged Product Received - Order #123456',
    body: `Dear Customer Support,\n\nI am writing to report that the blender I ordered under Order #123456 arrived damaged. The jar is cracked, and the motor does not start.\n\nOrder ID: #123456\nTransaction ID: TX001234\nCustomer ID: 101010\nContact: 9876543210\nLocation: Mumbai\n\nPlease arrange for a replacement or initiate a refund for this defective item.\n\nThank you,\nPriya Singh`,
    mailDate: 'Fri, 29 Nov 2024 12:00:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Priya Singh'],
    processedSentimentScore: -0.4,
    processedEmail: ['priya.singh@gmail.com'],
    processedPhone: ['9876543210'],
    processedOrderId: ['123456'],
    processedTransactionId: ['TX001234'],
    processedShortSummary: 'Customer Priya Singh reports receiving a damaged blender under Order #123456 and requests a replacement or refund.',
    processedFinalRequest: 'replacement or refund',
    processedLocation: 'Mumbai',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 'Ramesh Yadav <ramesh.yadav@gmail.com>',
    mailName: 'Ramesh Yadav',
    mailEmail: 'ramesh.yadav@gmail.com',
    subject: 'Missing Items in Order - Order #987654',
    body: `Dear Team,\n\nMy recent order #987654 is missing two items: a power bank and a charging cable. The invoice lists them as delivered.\n\nOrder ID: #987654\nTransaction ID: TX098765\nCustomer ID: 202020\nContact: 9123456789\nLocation: Delhi\n\nPlease send the missing items or provide a refund for them.\n\nRegards,\nRamesh Yadav`,
    mailDate: 'Thu, 28 Nov 2024 10:15:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Ramesh Yadav'],
    processedSentimentScore: -0.3,
    processedEmail: ['ramesh.yadav@gmail.com'],
    processedPhone: ['9123456789'],
    processedOrderId: ['987654'],
    processedTransactionId: ['TX098765'],
    processedShortSummary: 'Customer Ramesh Yadav reports missing items in Order #987654 and requests a resolution.',
    processedFinalRequest: 'replacement or refund',
    processedLocation: 'Delhi',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 'Deepika Rao <deepika.rao@gmail.com>',
    mailName: 'Deepika Rao',
    mailEmail: 'deepika.rao@gmail.com',
    subject: 'Refund Not Processed - Order #456789',
    body: `Dear Support Team,\n\nIt has been two weeks since I returned the defective microwave (Order #456789), but I haven’t received my refund yet.\n\nOrder ID: #456789\nTransaction ID: TX123456\nCustomer ID: 303030\nContact: 9812345678\nLocation: Bangalore\n\nPlease expedite the refund process and confirm the timeline.\n\nThank you,\nDeepika Rao`,
    mailDate: 'Wed, 27 Nov 2024 14:00:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Deepika Rao'],
    processedSentimentScore: -0.35,
    processedEmail: ['deepika.rao@gmail.com'],
    processedPhone: ['9812345678'],
    processedOrderId: ['456789'],
    processedTransactionId: ['TX123456'],
    processedShortSummary: 'Customer Deepika Rao reports a delayed refund for Order #456789 and requests an update.',
    processedFinalRequest: 'refund confirmation',
    processedLocation: 'Bangalore',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 'Amit Kumar <amit.kumar@gmail.com>',
    mailName: 'Amit Kumar',
    mailEmail: 'amit.kumar@gmail.com',
    subject: 'Delivery Delay - Order #654321',
    body: `Dear Customer Care,\n\nMy order #654321 was supposed to arrive last week, but it has still not been delivered. The tracking status shows 'In Transit.'\n\nOrder ID: #654321\nTransaction ID: TX654321\nCustomer ID: 404040\nContact: 9871234567\nLocation: Kolkata\n\nPlease update me on the delivery status.\n\nThanks,\nAmit Kumar`,
    mailDate: 'Tue, 26 Nov 2024 16:00:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Amit Kumar'],
    processedSentimentScore: -0.3,
    processedEmail: ['amit.kumar@gmail.com'],
    processedPhone: ['9871234567'],
    processedOrderId: ['654321'],
    processedTransactionId: ['TX654321'],
    processedShortSummary: 'Customer Amit Kumar reports a delivery delay for Order #654321 and requests an update.',
    processedFinalRequest: 'delivery update',
    processedLocation: 'Kolkata',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 'Sneha Patel <sneha.patel@gmail.com>',
    mailName: 'Sneha Patel',
    mailEmail: 'sneha.patel@gmail.com',
    subject: 'Faulty Item Received - Order #777888',
    body: `Dear Team,\n\nThe mobile charger I received under Order #777888 is faulty. It doesn’t charge any device.\n\nOrder ID: #777888\nTransaction ID: TX777888\nCustomer ID: 505050\nContact: 9823456789\nLocation: Pune\n\nPlease send a replacement as soon as possible.\n\nBest regards,\nSneha Patel`,
    mailDate: 'Mon, 25 Nov 2024 11:30:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Sneha Patel'],
    processedSentimentScore: -0.3,
    processedEmail: ['sneha.patel@gmail.com'],
    processedPhone: ['9823456789'],
    processedOrderId: ['777888'],
    processedTransactionId: ['TX777888'],
    processedShortSummary: 'Customer Sneha Patel reports receiving a faulty mobile charger under Order #777888 and requests a replacement.',
    processedFinalRequest: 'replacement',
    processedLocation: 'Pune',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 'Ankit Jain <ankit.jain@gmail.com>',
    mailName: 'Ankit Jain',
    mailEmail: 'ankit.jain@gmail.com',
    subject: 'Incorrect Billing Amount - Order #333444',
    body: `Dear Support,\n\nThe invoice for my Order #333444 shows an overcharged amount of Rs. 2,000 instead of Rs. 1,500. Kindly correct this.\n\nOrder ID: #333444\nTransaction ID: TX333444\nCustomer ID: 606060\nContact: 9801234567\nLocation: Jaipur\n\nPlease rectify the bill and process the refund for the extra amount.\n\nThanks,\nAnkit Jain`,
    mailDate: 'Sun, 24 Nov 2024 10:00:00 +0530',
    labels: ['CATEGORY_PERSONAL', 'INBOX'],
    status: 'processed',
    mailType: 'complaints',
    processedName: ['Ankit Jain'],
    processedSentimentScore: -0.3,
    processedEmail: ['ankit.jain@gmail.com'],
    processedPhone: ['9801234567'],
    processedOrderId: ['333444'],
    processedTransactionId: ['TX333444'],
    processedShortSummary: 'Customer Ankit Jain reports an overcharged invoice for Order #333444 and requests a correction.',
    processedFinalRequest: 'refund correction',
    processedLocation: 'Jaipur',
    createdAt: new Date(),
    updatedAt: new Date()
  }  
]

app.post('/3434322', (req,res)=>{
  mailSchema.insertMany(maalMasala)
    .then(() => {
      console.log('Data inserted successfully for Chandra Hospital in Ghaziabad');
    })
    .catch((err) => {
      console.error('Error inserting data:', err);
    });

})