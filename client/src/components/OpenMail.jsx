import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../styles/openMail.css';

const OpenMail = () => {
    const [IDdata, setIDData] = useState({});
    const { id } = useParams();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/dashboard/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setIDData(data);
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };

    // Helper function for displaying a field with fallback
    const renderField = (field) => (field ? field : 'None');

    // Helper function to trim lengthy fields
    const trimField = (field, length = 30) =>
        // field && field.length > length ? `${field.slice(0, length)}...` : field || 'None';
    console.log('hi')
    return (
        <div className='open-mail-container'>
            <h1 className='open-mail-title'>Detailed Mail View</h1>

            <div className='open-mail-section open-mail-general'>
                <h2 className='open-mail-section-title'>General Details</h2>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Mail ID:</span>
                    <span className='open-mail-value'>{renderField(IDdata._id)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Thread ID:</span>
                    <span className='open-mail-value'>{renderField(IDdata.threadId)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Subject:</span>
                    <span className='open-mail-value'>{renderField(IDdata.subject)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>From:</span>
                    <span className='open-mail-value'>{IDdata.from}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>To:</span>
                    <span className='open-mail-value'>{IDdata.to}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Mail Type:</span>
                    <span className='open-mail-value'>{renderField(IDdata.mailType)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Mail Date:</span>
                    <span className='open-mail-value'>{renderField(new Date(IDdata.mailDate).toLocaleDateString())}</span>
                </div>
            </div>

            <div className='open-mail-section open-mail-processed'>
                <h2 className='open-mail-section-title'>Processed Details</h2>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Processed Emails:</span>
                    <span className='open-mail-value'>
                        {IDdata.processedEmail?.map((email) => email).join(', ') || 'None'}
                    </span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Processed Name:</span>
                    <span className='open-mail-value'>
                        {IDdata.processedName?.join(', ') || 'None'}
                    </span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Order ID:</span>
                    <span className='open-mail-value'>
                        {IDdata.processedOrderId?.join(', ') || 'None'}
                    </span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Phone Numbers:</span>
                    <span className='open-mail-value'>
                        {IDdata.processedPhone?.join(', ') || 'None'}
                    </span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Sentiment Score:</span>
                    <span className='open-mail-value'>{renderField(IDdata.processedSentimentScore)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Short Summary:</span>
                    <span className='open-mail-value'>{renderField(IDdata.processedShortSummary)}</span>
                </div>
                <div className='open-mail-field'>
                    <span className='open-mail-label'>Final Request:</span>
                    <span className='open-mail-value'>{renderField(IDdata.processedFinalRequest)}</span>
                </div>
            </div>

            <div className='open-mail-section open-mail-body'>
                <h2 className='open-mail-section-title'>Mail Body</h2>
                <p className='open-mail-body-content'>{renderField(IDdata.body)}</p>
            </div>
        </div>
    );
};

export default OpenMail;