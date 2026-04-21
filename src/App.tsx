import React, { useEffect, useState } from 'react';
import Landing  from './pages/Landing';
import AuthPage from './components/Authpage';
import './styles/global.css';

declare global {
  interface Window {
    __goAuth?: () => void;
    __goHome?: () => void;
  }
}

type Page = 'landing' | 'auth';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');

  useEffect(() => {
    window.__goAuth = () => setPage('auth');
    window.__goHome = () => setPage('landing');

    return () => {
      delete window.__goAuth;
      delete window.__goHome;
    };
  }, []);

  if (page === 'auth') return <AuthPage />;
  return <Landing />;
};

export default App;