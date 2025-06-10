import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANy2r9jDjgd7HvFihqytEVKPnqwaxSU_g",
  authDomain: "authen-authenlog.firebaseapp.com",
  projectId: "authen-authenlog",
  storageBucket: "authen-authenlog.firebasestorage.app",
  messagingSenderId: "854986830209",
  appId: "1:854986830209:web:bd81febc53a88159d23880",
  measurementId: "G-9J5NCPHG2W"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };