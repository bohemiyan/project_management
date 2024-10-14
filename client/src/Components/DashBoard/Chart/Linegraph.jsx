import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#cafaf6',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)', // added shadow
}));

const LineGraph = ({ data }) => {
  const formattedData = data.map(item => ({
    appliedOn: new Date(item.appliedOn).toLocaleDateString('en-US'), // formatted to mm/dd/yyyy
    numberOfApplicants: item.numberOfApplicants
}));


  const options = {
    chart: {
      background: '#cafaf6', // cream background
      foreColor: '#488be8',
    },
    title: {
      text: 'Job Applicants Over Time',
      aling:'top',
    },
    xaxis: {
      categories: formattedData.map(item => item.appliedOn),
      title: {
        text: 'Date',
      },
    },
    yaxis: {
      title: {
        text: 'Number of Applicants',
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 6,
    },
    colors: ['#1976D2'],
  };

  const series = [
    {
      name: 'Number of Applicants',
      data: formattedData.map(item => item.numberOfApplicants),
    },
  ];

  return (
    <StyledBox>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </StyledBox>
  );
};

export default LineGraph;
