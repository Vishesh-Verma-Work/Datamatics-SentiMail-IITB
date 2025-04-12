import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import '../styles/visualData.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CategoryDistributionChart = () => {
  useEffect(() => {
    getData();
  }, []);

  const [categoryData, setCategoryData] = useState({});
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

  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Emails by Category',
        data: categoryValues,
        backgroundColor: '#42a5f5',
        borderColor: '#1e88e5',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: Object.values(sentimentData),
        backgroundColor: ['#66bb6a', '#ffee58', '#ef5350'],
        hoverBackgroundColor: ['#81c784', '#fff176', '#e57373'],
      },
    ],
  };

  const stackedSentimentData = {
    labels: ['Sentiment Summary'],
    datasets: [
      {
        label: 'Positive',
        data: [sentimentData.positive],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Neutral',
        data: [sentimentData.neutral],
        backgroundColor: '#FFC107',
      },
      {
        label: 'Negative',
        data: [sentimentData.negative],
        backgroundColor: '#F44336',
      },
    ],
  };

  const lineData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Email Volume Over Time (Static)',
        data: categoryValues,
        borderColor: '#29b6f6',
        backgroundColor: 'rgba(41, 182, 246, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const doughnutData = pieData;

  const horizontalBarData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Volume',
        data: Object.values(sentimentData),
        backgroundColor: ['#00C853', '#FFD600', '#D50000'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...categoryValues) * 1.1, // Increase max by 10% to create space
      },
    },
  };
  

  return (
    <div className='vis-chart-main'>
      <h1 className='vis-chart-title'>Sentimail Dashboard</h1>
      <p className='vis-chart-description'>Here’s an overview of all categorized email data and sentiment-based analysis. These charts reflect static processed email logs.</p>


      {/* the card screen component --> */}
      <div className="vis-kpi-cards">
  <div className="vis-kpi-card">
    <h4>Total Emails</h4>
    <p>{Object.values(categoryData).reduce((a, b) => a + b, 0)}</p>
  </div>

  <div className="vis-kpi-card">
    <h4>Total Complaints</h4>
    <p>{categoryData.complaints || 0}</p>
  </div>

  <div className="vis-kpi-card">
    <h4>Positive Sentiment</h4>
    <p>
      {sentimentData.positive + sentimentData.neutral + sentimentData.negative > 0
        ? `${Math.round((sentimentData.positive /
            (sentimentData.positive + sentimentData.neutral + sentimentData.negative)) * 100)}%`
        : '0%'}
    </p>
  </div>

  <div className="vis-kpi-card">
    <h4>Avg Sentiment Score</h4>
    <p>
      {sentimentData.positive + sentimentData.neutral + sentimentData.negative > 0
        ? (
            (sentimentData.positive * 1 + sentimentData.neutral * 0 + sentimentData.negative * -1) /
            (sentimentData.positive + sentimentData.neutral + sentimentData.negative)
          ).toFixed(2)
        : '0.00'}
    </p>
  </div>
</div>




      <div className='vis-chart-grid'>
        <div className='vis-chart-full'>
          <h3>Email Category Distribution</h3>
          <p>This chart shows how many emails fall under each type like complaints, feedback, support, etc.</p>
          <Bar data={barData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Sentiment Distribution</h3>
          <Pie data={pieData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Sentiment Volume Breakdown</h3>
          <Bar data={horizontalBarData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Stacked Sentiment Comparison</h3>
          <Bar data={stackedSentimentData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Email Trends (Static Simulation)</h3>
          <Line data={lineData} options={options} />
        </div>

        <div className='vis-chart-full'>
          <h3>Sentiment Doughnut Overview</h3>
          <p>This chart gives an easy-to-read visual on how many messages were positive, neutral, or negative.</p>
          <Doughnut data={doughnutData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Simulated Category Analysis</h3>
          <p>Repetition of the category bar for stylistic layout testing.</p>
          <Bar data={barData} options={options} />
        </div>

        <div className='vis-chart-half'>
          <h3>Mini Sentiment Breakdown</h3>
          <Pie data={pieData} options={options} />
        </div>
      </div>
      
    </div>
  );
};

export default CategoryDistributionChart;
