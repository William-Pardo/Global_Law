
import React, { useState } from 'react';
import type { Client, User } from '../types';
import { ProcessStage } from '../types';
import ClientCard from './ClientCard';

interface KanbanColumnProps {
  stage: ProcessStage;
  clients: Client[];
  onDrop: (newStatus: ProcessStage) => void;
  onDragStart: (clientId: string) => void;
  currentUser: User;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, clients, onDrop, onDragStart, currentUser }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(stage);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-80 flex-shrink-0 bg-gray-100 rounded-lg shadow-sm transition-colors duration-300 ${isOver ? 'bg-sky-100' : ''}`}
    >
      <div className="p-4 border-b-4 border-brand-blue/70">
        <h2 className="text-lg font-bold text-brand-gray flex justify-between items-center">
          <span>{stage}</span>
          <span className="text-sm font-semibold bg-brand-blue text-white rounded-full h-6 w-6 flex items-center justify-center">{clients.length}</span>
        </h2>
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto">
        {clients.map(client => (
          <ClientCard key={client.id} client={client} onDragStart={onDragStart} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
