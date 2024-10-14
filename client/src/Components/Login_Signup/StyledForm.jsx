import { styled } from '@mui/system';
import { Container, Box, Button } from '@mui/material';

export const Root = styled('div')(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#b3cde0',
  padding: theme.spacing(2),
}));

export const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '480px !important',  // Reduced maxWidth
  width: '100%',
}));

export const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'flex-end',
}));

export const Icon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#085ff7',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0542ac',
  },
}));

export const Logo = styled('img')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    width: '100px', // Adjust the width according to your logo size
  }));


export const RegisterButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#085ff7',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#0542ac',
  },
}));


