import React, { useState } from 'react';
import type { Client, User } from '../types';
import { useUser } from '../contexts/UserContext';
import { crmService } from '../services/crmService';
import { useNotification } from '../contexts/NotificationContext';

interface ClientDetailModalProps {
  client: Client;
  onClose: () => void;
  currentUser: User;
}

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose, currentUser }) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();
  const { users } = useUser();

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
        await crmService.addNote(client.id, newNote, currentUser);
        setNewNote('');
        addNotification('Note added successfully!', 'success');
        // In a real app, you'd refetch or update state more gracefully
        onClose(); // Close modal on success
        window.location.reload(); // Simple refresh
    } catch (error) {
        console.error("Failed to add note:", error);
        addNotification('Could not add note.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-brand-gray">{client.name}</h2>
                <p className="text-sm text-gray-500">{client.service}</p>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 -mr-2 -mt-2 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div><strong>Email:</strong> <span className="text-gray-700">{client.email}</span></div>
                <div><strong>Phone:</strong> <span className="text-gray-700">{client.phone}</span></div>
                <div><strong>Status:</strong> <span className="font-semibold text-brand-blue">{client.status}</span></div>
                <div><strong>Assigned To:</strong> <span className="text-gray-700">{users.find(u => u.id === client.assignedTo)?.name}</span></div>
                <div><strong>Contact Date:</strong> <span className="text-gray-700">{new Date(client.contactDate).toLocaleDateString()}</span></div>
                <div><strong>Last Update:</strong> <span className="text-gray-700">{new Date(client.lastUpdate).toLocaleString()}</span></div>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-lg text-brand-gray mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {client.tags.length > 0 ? client.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-sm font-semibold bg-sky-100 text-sky-800 rounded-full">{tag}</span>
                    )) : <p className="text-sm text-gray-500">No tags assigned.</p>}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-lg text-brand-gray mb-2">Notes & History</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {[...client.notes].reverse().map(note => (
                         <div key={note.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <p className="text-sm text-gray-800">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">{note.author} - {new Date(note.date).toLocaleString()}</p>
                         </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50">
             <form onSubmit={handleAddNote}>
                <label htmlFor="new-note" className="block text-sm font-medium text-gray-700 mb-1">Add a new note</label>
                <textarea
                    id="new-note"
                    rows={3}
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    className="w-full rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-brand-gray text-white placeholder-gray-300"
                    placeholder="Type your note here..."
                />
                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !newNote.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Saving...' : 'Add Note'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;