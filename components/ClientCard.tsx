
import React, { useState } from 'react';
import type { Client, User } from '../types';
import { useUser } from '../contexts/UserContext';
import ClientDetailModal from './ClientDetailModal';

interface ClientCardProps {
  client: Client;
  onDragStart: (clientId: string) => void;
  currentUser: User;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDragStart, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { users } = useUser();
  const assignedAdvisor = users.find(u => u.id === client.assignedTo);
  
  const timeSinceUpdate = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };


  return (
    <>
      <div
        draggable
        onDragStart={() => onDragStart(client.id)}
        onClick={() => setIsModalOpen(true)}
        className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-brand-blue"
      >
        <h3 className="font-bold text-brand-gray">{client.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{client.service}</p>
        <div className="flex flex-wrap gap-1 mt-2">
            {client.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full">{tag}</span>
            ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>{assignedAdvisor?.name || 'Unassigned'}</span>
          <span>{timeSinceUpdate(client.lastUpdate)}</span>
        </div>
      </div>
      {isModalOpen && (
        <ClientDetailModal 
            client={client} 
            onClose={() => setIsModalOpen(false)}
            currentUser={currentUser}
        />
      )}
    </>
  );
};

export default ClientCard;
