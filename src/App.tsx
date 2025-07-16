
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from './types';
import { useUser } from './contexts/UserContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import ClientTable from './components/ClientTable';
import NotificationManager from './components/NotificationManager';
import UserSettings from './components/UserSettings';
import Integrations from './components/Integrations';

const App: React.FC = () => {
  const { users, loading: usersLoading } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!usersLoading && users.length > 0 && !currentUser) {
      setCurrentUser(users.find(u => u.role === 'Admin') || users[0]);
    }
  }, [users, usersLoading, currentUser]);


  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId) || (users.length > 0 ? users[0] : null);
    setCurrentUser(user);
  };

  if (!currentUser) {
      return (
        <div className="flex h-screen w-full justify-center items-center font-sans">
            <p className="text-brand-gray text-lg">Loading application...</p>
        </div>
      );
  }

  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex h-screen bg-gray-50 font-sans text-brand-gray">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onUserChange={handleUserChange} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <>
      <NotificationManager />
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard currentUser={currentUser} /></MainLayout>} />
          <Route path="/funnel" element={<MainLayout><KanbanBoard currentUser={currentUser} /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><ClientTable currentUser={currentUser} /></MainLayout>} />
          {currentUser.role === 'Admin' && (
            <>
              <Route path="/settings" element={<MainLayout><UserSettings currentUser={currentUser} onUserChange={handleUserChange} /></MainLayout>} />
              <Route path="/integrations" element={<MainLayout><Integrations /></MainLayout>} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default App;