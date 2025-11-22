// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './components/auth/signup.css';
import SignUp from './components/auth/signup.jsx';

createRoot(document.getElementById('root')).render(
    <SignUp />
);
