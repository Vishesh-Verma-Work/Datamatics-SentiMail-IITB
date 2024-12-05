import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/visualData.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CategoryDistributionChart = () => {
  useEffect(() => {
    getData();
  }, []);

  const [categoryData, setCategoryData] = useState({});
  const [get, setGet] = useState({});
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  const getData = async () => {
    try {
      const data = await fetch('http://localhost:3000/countheader');
      const sentiment = await fetch('http://localhost:3000/getsentiments');
      const jsonData = await data.json();
      const jsonSentiment = await sentiment.json();

      // Process category data
      const {
        feedback,
        complaints,
        queries,
        supportRequests,
        appreciation,
        subUns,
        others,
      } = jsonData;

      setCategoryData({
        feedback,
        complaints,
        queries,
        supportRequests,
        appreciation,
        subUns,
        others,
      });

      // Process sentiment data
      let positive = 0,
        neutral = 0,
        negative = 0;

      jsonSentiment.forEach(({ processedSentimentScore }) => {
        if (processedSentimentScore > 0.2) {
          positive++;
        } else if (processedSentimentScore >= -0.2) {
          neutral++;
        } else {
          negative++;
        }
      });

      setSentimentData({ positive, neutral, negative });
    } catch (e) {
      console.log(e);
    }
  };

  // Data for the bar chart
  const barData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
          data: Object.values(categoryData),
          backgroundColor: [
              '#6A9FB5',
              '#8FC1A9',
              '#FFD97D',
              '#F4B400',
              '#F28C8C',
              '#C792E8',
              '#8D99AE',
            ],
            borderColor: '#333',
            borderWidth: 1,
            label: 'Number of Emails',
      },
    ],
  };

  // Data for the pie chart
  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: Object.values(sentimentData),
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#60B4F6', '#FFE29A', '#FF8CA2'],
      },
    ],
  };

  // Options for the bar chart
  const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
          },
      title: {
        display: true,
        // text: 'Email Category Distribution',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        suggestedMax: Math.max(...Object.values(categoryData)) + 1,
      },
    },
  };

  // Options for the pie chart
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        // text: 'Sentiment Distribution',
      },
    },
  };

  return (
    <>
    <div className='chart-main'>
    <div className='chat-title'>
        <h3>Email Category Distribution</h3>
        <h3>Sentiment Distribution</h3>
    </div>
    <div className='chart-wrapper'>
      <div className='chart-container bar-chart'>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className='chart-container pie-chart'>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
    </div>
    </>
  );
};

export default CategoryDistributionChart;
