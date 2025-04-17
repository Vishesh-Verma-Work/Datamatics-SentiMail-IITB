import React, { useState, useEffect } from 'react';
import '../styles/showEmails.css';

const ShowMail = () => {
  const [emails, setEmails] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    try {
      const emailData = await fetch('http://localhost:3000/getemails');
      const emailDataJson = await emailData.json();
      setEmails(emailDataJson);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    }
  };

  const formatBody = (body) => {
    return body.replace(/(?:\r\n|\r|\n)/g, '<br />');
  };

  const toggleExpand = (emailId) => {
    setExpanded((prev) => ({
      ...prev,
      [emailId]: !prev[emailId], 
    }));
  };

  return (
    <>
      <h3 className='num'>Number of Mails ({emails.length})</h3>
      <div className='main'>
        {emails.slice().reverse().map((email) => (
          <div key={email._id} className='mail-container'>
            <div className='mail-header'>
              <h1>{email.subject}</h1>
              <div className='mail-meta'>
                <p>
                  <strong>From:</strong> {email.from}
                </p>
                <p>
                  <strong>To:</strong> {email.to}
                </p>
                {email.cc && (
                  <p>
                    <strong>CC:</strong> {email.cc}
                  </p>
                )}
                <p>
                  <strong>Date:</strong> {email.mailDate}
                </p>
              </div>
            </div>

            <div className='mail-body'>
              <h2>Body :</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    expanded[email._id]
                      ? formatBody(email.body) // Show full body if expanded
                      : formatBody(email.body).substring(0, 300) + '...' // Truncate to 300 characters
                }}
              />
              <button
                className='show-more-btn'
                onClick={() => toggleExpand(email._id)}
              >
                {expanded[email._id] ? 'Show Less' : 'Show More'}
              </button>
            </div>

            <div className='mail-footer'>
              <h3>Labels</h3>
              <div className='mail-labels'>
                {email.labels.map((label, index) => (
                  <span key={index} className='label'>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShowMail;
