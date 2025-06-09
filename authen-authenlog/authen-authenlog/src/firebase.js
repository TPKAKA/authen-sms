import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFXzbZ9wgnos4WFJk7LDxGrv7t7_HnKtw",
  authDomain: "otp-d1e76.firebaseapp.com",
  projectId: "otp-d1e76",
  storageBucket: "otp-d1e76.firebasestorage.app",
  messagingSenderId: "369597870122",
  appId: "1:369597870122:web:bc29ba8e69f0aae2251353",
  measurementId: "G-ZBXZJBPPSN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };