const mongoose = require('mongoose');

const mailModel = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    threadId: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    mailName: {
        type: String,
    },
    mailEmail: {
        type: String,
    },
    to: {
        type: String,
        required: true
    },
    cc: {
        type: String,
        default: null
    },
    subject: {
        type: String,
        default: null
    },
    mailDate : {
        type : String,
        required : true
    },
    fileName: {
        type: String,
        default: null
    },
    labels: {
        type: [String],
        default: []
    },
    body: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['fetch', 'processed'],
        default: 'fetch'
    },


    mailType: {
        type: String,
        enum: ['none', 'feedback', 'complaints', 'queries', 'supportRequests', 'appreciation', 'subscription/uns', 'others'],
        default: 'none'
    },
    
    processedName: {
        type : [String],
        default: null
    },
    processedSentimentScore: {
        type: Number,
        default: null
    },
    processedEmail: {
        type: [String],  
        default: []
    },
    processedPhone: {
        type: [String],  
        default: []
    },
    processedOrderId: {
        type: [String],  
        default: []
    },
    processedTransactionId: {
        type: [String],  
        default: []
    },
    // processedCustomerId: {
    //     type: String,  
    // },
    processedShortSummary: {
        type: String,
        default: null
    },
    processedFinalRequest: {
        type: String,
        default: null
    },
    processedLocation: {
        type: String,   
        default: null
    }
}, { timestamps: true });

const mailSchema = mongoose.model('Mail', mailModel);
module.exports = mailSchema;
