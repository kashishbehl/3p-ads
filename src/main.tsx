import React from 'react';
import ReactDOM from 'react-dom/client';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@razorpay/blade/fonts.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BladeProvider>
  </React.StrictMode>
);
