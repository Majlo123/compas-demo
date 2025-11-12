import '@/App.scss';
import { FC, useEffect } from 'react';

import Router from '@/components/router/Router.tsx';
import LoadingPage from '@/pages/loading-page/LoadingPage';
import { ToastProvider } from '@/providers/ToastProvider.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: FC<AppShellProps> = ({ children }) => {
  return (
    <div id="app" className="flex flex-col w-screen h-screen overflow-hidden">
      {children}
    </div>
  );
};

const App: FC = () => {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <AppShell>
        <LoadingPage />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Router />
      <ToastProvider />
    </AppShell>
  );
};

export default App;
