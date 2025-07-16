import React from 'react';
import type { User } from '../types';
import Logo from './ui/Logo';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  currentUser: User;
  onUserChange: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange }) => {
  const { users } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm flex-shrink-0">
      <div className="flex items-center">
        <Logo className="h-8 w-auto" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            {currentUser.role === 'Admin' && (
                <span className="hidden lg:inline-flex text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                  Admin View
                </span>
            )}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <select
            value={currentUser.id}
            onChange={(e) => onUserChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 bg-white text-brand-gray"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;