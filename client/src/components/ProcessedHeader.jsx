import React, { useEffect, useState } from 'react';
import '../styles/processedHeader.css';
import { NavLink } from 'react-router';

const ProcessedHeader = () => {
  const [headerData, setHeaderData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getData();
    showData('allprocessed');
  }, []);

  const getData = async () => {
    const data = await fetch('http://localhost:3000/countheader');
    const jsonData = await data.json();
    setHeaderData(jsonData);
    console.log(jsonData);
  };
  const {
    totalMails,
    feedback,
    complaints,
    queries,
    supportRequests,
    appreciation,
    subUns,
    others,
  } = headerData;

  const showData = async (mailTypeReq) => {
    const mailDatas = await fetch(`http://localhost:3000/${mailTypeReq}`);
    const mailDatasJson = await mailDatas.json();
  
    // Sorting mails by date (most recent first)
    const sortedMails = mailDatasJson.sort((a, b) => 
      new Date(b.mailDate) - new Date(a.mailDate)
    );
  
    setMailData(sortedMails);
    setName(mailTypeReq);
  };
  
  return (
    <>
      <div className='processedHeader'>
        <div className='processedHeader-items'>
          <div
            className='processedHeader-item'
            onClick={() => showData('allprocessed')}
          >
            <span className='processedHeader-label'>Show All</span>
            <span className='processedHeader-count'>({totalMails})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('feedback')}
          >
            <span className='processedHeader-label'>Feedback</span>
            <span className='processedHeader-count'>({feedback})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('complaints')}
          >
            <span className='processedHeader-label'>Complaints</span>
            <span className='processedHeader-count'>({complaints})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('queries')}
          >
            <span className='processedHeader-label'>Queries</span>
            <span className='processedHeader-count'>({queries})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('supportRequests')}
          >
            <span className='processedHeader-label'>Support Requests</span>
            <span className='processedHeader-count'>({supportRequests})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('appreciation')}
          >
            <span className='processedHeader-label'>Appreciation</span>
            <span className='processedHeader-count'>({appreciation})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('subscription')}
          >
            <span className='processedHeader-label'>
              Subscription/Unsubscription
            </span>
            <span className='processedHeader-count'>({subUns})</span>
          </div>
          <div
            className='processedHeader-item'
            onClick={() => showData('others')}
          >
            <span className='processedHeader-label'>Others</span>
            <span className='processedHeader-count'>({others})</span>
          </div>
        </div>
      </div>

      <h2 className='type-name'>{name}</h2>
      <div className='mailDataContainer'>
        {mailData.length > 0 ? (
          mailData.map((mail) => (
            <NavLink key={mail._id} to={`${mail._id}`}>
              <div className='mailItem'>
                <h3>
                  Final Req: {mail.processedFinalRequest || 'Appreciation'}
                </h3>
                <p>
                  <strong>Subject:</strong> {mail.subject || 'No Subject'}
                </p>
                <p>
                  <strong>Summary:</strong>{' '}
                  {mail.processedShortSummary || 'No Summary Available'}
                </p>
                <p>
                  <strong>Transaction ID:</strong>{' '}
                  {mail.processedTransactionId || 'none'}
                </p>
                <p>
                  <strong>Name:</strong>{' '}
                  {Array.isArray(mail.processedName)
                    ? mail.processedName.join(' | ')
                    : 'none'}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {mail.mailDate
                    ? new Date(mail.mailDate).toLocaleDateString()
                    : 'No Date Provided'}
                </p>
              </div>
            </NavLink>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </>
  );
};

export default ProcessedHeader;
