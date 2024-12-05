import React, { useEffect, useState } from 'react';

const PushMail = () => {
  const [loadingMessage, setLoadingMessage] = useState('The Data is being pushed... Please Wait');

  useEffect(() => {
    pushData();
  }, []);

  const pushData = async () => {
    try {
      const response = await fetch('http://localhost:3000/pushemails');

      if (!response.ok) {
        const data = await response.json();
        setLoadingMessage('Failed to push data. Please try again.');
      } else {
        setLoadingMessage('The Data has been Pushed into the DataBase!!');
      }
    } catch (error) {
    }
  };

  return (
    <div>
      <h1>{loadingMessage}</h1>
    </div>
  );
};

export default PushMail;
