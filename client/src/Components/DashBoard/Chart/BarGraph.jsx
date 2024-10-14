import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#cafaf6', // cream background
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)', // shadow
}));

const BarGraph = ({ companies }) => {
  const formattedData = companies.flatMap(company =>
    company.jobs.map(job => ({
      jobTitle: job.jobTitle,
      totalApplicants: job.totalApplicants
    }))
  );
  const options = {
    chart: {
      type: 'bar',
      background: '#cafaf6', // cream background
      foreColor: '#333',
    },
    title: {
      text: 'Job Applicants by Jobs',
      aling:'center',
    },
    xaxis: {
      categories: formattedData.map(item => item.jobTitle),
      title: {
        text: 'Job Title',
      },
    },
    yaxis: {
      title: {
        text: 'Number of Applicants',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`, // show count on each bar
      style: {
        colors: ['#333'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    colors: ['#1976D2'], // blue bars
  };

  const series = [
    {
      name: 'Number of Applicants',
      data: formattedData.map(item => item.totalApplicants),
    },
  ];

  return (
    <StyledBox>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </StyledBox>
  );
};

export default BarGraph;
