import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Donut = ({ company }) => {
  // Prepare data for pie chart
  const jobData = company.jobs.map(job => ({
    jobTitle: job.jobTitle,
    totalApplicants: job.totalApplicants
  }));
  const totalApplicants = jobData.reduce((total, job) => total + job.totalApplicants, 0);

  const options = {
    chart: {
      type: 'donut',
      background: '#FFFFFF', // white background
      foreColor: '#333',
    },
    title: {
      text: `${company.companyName}`,
      align: 'top',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    labels: jobData.map(item => item.jobTitle),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString(); // show count on each slice
      },
      style: {
        colors: ['#333'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '11px',
      fontWeight: 'bold',
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val.toString() + ' applicants'; // tooltip format
        },
      },
    },
    plotOptions: {
      pie: {
        size: '35%', // adjust pie size as needed
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontSize: '14px',
              color: '#333',
              formatter: function () {
                return totalApplicants.toString(); // display total applicants in the center
              }
            }
          }
        },
      },
    },
    colors: ['#1976D2', '#388E3C', '#FBC02D', '#E64A19', '#7B1FA2', '#757575'], // basic colors for slices
  };

  const series = jobData.map(item => item.totalApplicants);

  return (
    <ReactApexChart options={options} series={series} type="donut" height={300} />
  );
};

export default Donut;
