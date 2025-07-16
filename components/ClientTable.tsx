import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { crmService } from '../services/crmService';
import type { Client, User } from '../types';
import { useUser } from '../contexts/UserContext';
import ClientDetailModal from './ClientDetailModal';

const ClientTable: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { users } = useUser();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const data = await crmService.getClients(currentUser);
    setClients(data);
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const sortedClients = useMemo(() => {
    let sortableClients = [...clients];
    if (sortConfig !== null) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  }, [clients, sortConfig]);

  const filteredClients = useMemo(() => {
    return sortedClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedClients, searchTerm]);

  const requestSort = (key: keyof Client) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-brand-gray">All Clients</h1>
        <input
          type="text"
          placeholder="Search by name, email, status..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-transparent rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-brand-gray text-white placeholder-gray-300"
        />
      </div>

       {currentUser.role === 'Admin' && (
        <div className="mb-4 p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-md text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            As an administrator, you are viewing all clients in the system.
        </div>
      )}

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['name', 'status', 'assignedTo', 'lastUpdate'].map((key) => (
                  <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort(key as keyof Client)} className="flex items-center">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      <span className="ml-1">{getSortIndicator(key as keyof Client)}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map(client => (
                <tr key={client.id} onClick={() => setSelectedClient(client)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-gray">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sky-100 text-sky-800">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {users.find(u => u.id === client.assignedTo)?.name ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.lastUpdate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {selectedClient && (
        <ClientDetailModal 
            client={selectedClient} 
            onClose={() => {
                setSelectedClient(null);
                fetchClients(); // Refetch data when modal closes
            }}
            currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ClientTable;