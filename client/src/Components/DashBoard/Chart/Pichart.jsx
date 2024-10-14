import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ company }) => {
  // Prepare data for pie chart
  const jobData = company.jobs.map(job => ({
    jobTitle: job.jobTitle,
    totalApplicants: job.totalApplicants
  }));

  const totalApplicants = jobData.reduce((total, job) => total + job.totalApplicants, 0);

  const options = {
    chart: {
      type: 'pie',
      background: '#FFFDD0', // cream background
      foreColor: '#333',
    },
    title: {
      text: `Applicants Distribution for ${company.companyName}`,
      align: 'left',
    },
    labels: jobData.map(item => item.jobTitle),
    dataLabels: {
      enabled: false,
      formatter: (val) => `${val}`, // show count on each slice
      style: {
        colors: ['#333'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} applicants`, // tooltip format
      },
    },
    plotOptions: {
      pie: {
        size: 200, // adjust pie size as needed
        donut: {
          size: '65%',
        },
      },
    },
    colors: ['#1976D2', '#388E3C', '#FBC02D', '#E64A19', '#7B1FA2', '#757575'], // colors for slices
  };

  const series = jobData.map(item => item.totalApplicants);

  return (
    <div style={{ position: 'relative' }}>
      <ReactApexChart options={options} series={series} type="pie" height={350} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', textAlign: 'right', color: '#555' }}>
        <p>Total Applicants:</p>
        <h3>{totalApplicants}</h3>
      </div>
    </div>
  );
};

export default PieChart;
