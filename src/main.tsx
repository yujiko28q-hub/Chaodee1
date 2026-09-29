import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider, RentalProvider } from './context';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RentalProvider>
        <App />
      </RentalProvider>
    </AuthProvider>
  </StrictMode>,
);

