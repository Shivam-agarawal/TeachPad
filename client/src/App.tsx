import React from 'react';
import { ErrorBoundary } from './app/error-boundary';
import { AppRouter } from './app/router';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
};

export default App;
