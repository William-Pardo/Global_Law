import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserProvider } from './contexts/UserContext';
import { MetaIntegrationProvider } from './contexts/MetaIntegrationContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <UserProvider>
        <MetaIntegrationProvider>
          <App />
        </MetaIntegrationProvider>
      </UserProvider>
    </NotificationProvider>
  </React.StrictMode>
);