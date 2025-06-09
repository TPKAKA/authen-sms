import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, styled } from '@mui/material';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebase';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  maxWidth: '400px',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  gap: theme.spacing(2),
}));

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    // Remove any spaces, dashes, or parentheses
    const cleaned = number.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with + and has at least 10 digits after country code
    if (!cleaned.startsWith('+')) {
      return 'Phone number must start with + followed by country code';
    }
    
    // Check if it has enough digits (country code + at least 10 digits)
    if (cleaned.length < 12) {
      return 'Phone number must be at least 12 digits including country code';
    }
    
    // Check if it contains only valid characters
    if (!/^\+[0-9]+$/.test(cleaned)) {
      return 'Phone number can only contain + and digits';
    }

    // Check if it's not too long (max 15 digits including country code)
    if (cleaned.length > 15) {
      return 'Phone number is too long';
    }
    
    return '';
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError(validatePhoneNumber(value));
  };

  useEffect(() => {
    try {
      if (!window.recaptchaVerifier && auth) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA verified');
          },
        });
        setRecaptchaInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }
  }, []);

  const onSendOtp = async () => {
    if (!recaptchaInitialized) {
      alert('Please wait while reCAPTCHA initializes');
      return;
    }

    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    try {
      setIsLoading(true);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      alert('OTP sent to ' + phoneNumber);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error during signInWithPhoneNumber', error);
      if (error.code === 'auth/invalid-phone-number') {
        setPhoneError('Invalid phone number format. Please check and try again.');
      } else {
        alert('Error sending OTP: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!window.confirmationResult) {
      alert('Please send OTP first');
      return;
    }

    try {
      setIsLoading(true);
      const result = await window.confirmationResult.confirm(otp);
      alert('Phone number verified!');
      console.log('Verification successful', result);
    } catch (error) {
      console.error('Error verifying OTP', error);
      alert('Error verifying OTP: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledBox>
      <TextField
        variant="outlined"
        label="Phone Number"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="+84987654321"
        error={!!phoneError}
        helperText={phoneError || "Enter number with country code (e.g., +84987654321)"}
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={onSendOtp}
        color="primary"
        type="button"
        disabled={!recaptchaInitialized || !!phoneError || isLoading}
      >
        {isLoading ? 'Sending...' : 'SEND OTP'}
      </Button>
      <TextField
        variant="outlined"
        label="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={onVerifyOtp}
        color="primary"
        type="button"
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
      <div id="recaptcha-container"></div>
    </StyledBox>
  );
}

export default App;