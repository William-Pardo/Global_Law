
import React, { useState, useEffect, useCallback } from 'react';
import { crmService } from '../services/crmService';
import type { Client, User } from '../types';
import { ProcessStage } from '../types';
import { PROCESS_STAGES_ORDER } from '../constants';
import KanbanColumn from './KanbanColumn';
import { useNotification } from '../contexts/NotificationContext';

const KanbanBoard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crmService.getClients(currentUser);
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      addNotification('Could not load client funnel.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser, addNotification]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDragStart = (clientId: string) => {
    setDraggedClientId(clientId);
  };

  const handleDrop = async (newStatus: ProcessStage) => {
    if (!draggedClientId) return;

    const originalClient = clients.find(c => c.id === draggedClientId);
    if (originalClient && originalClient.status !== newStatus) {
      // Optimistic update
      setClients(prevClients =>
        prevClients.map(c =>
          c.id === draggedClientId ? { ...c, status: newStatus, lastUpdate: new Date() } : c
        )
      );
      
      try {
        await crmService.updateClientStatus(draggedClientId, newStatus, currentUser);
        // Data is now synced with the "backend"
      } catch (error) {
        console.error('Failed to update client status:', error);
        // Rollback on error
        setClients(prevClients => 
            prevClients.map(c => c.id === draggedClientId ? originalClient : c)
        );
        addNotification('Could not update client status. Please try again.', 'error');
      }
    }
    setDraggedClientId(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p>Loading funnel...</p></div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-3xl font-bold text-brand-gray px-1 mb-4">Client Funnel</h1>
      <div className="flex-1 flex overflow-x-auto space-x-4 pb-4">
        {PROCESS_STAGES_ORDER.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            clients={clients.filter(client => client.status === stage)}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;