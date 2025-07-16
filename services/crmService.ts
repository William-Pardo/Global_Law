
import type { Client, Note, User, Role } from '../types';
import { ProcessStage } from '../types';
import { INITIAL_CLIENTS, INITIAL_USERS } from '../constants';

// This type represents how the data is stored "on the server" (i.e., after JSON serialization)
type StoredNote = Omit<Note, 'date'> & { date: string };
type StoredClient = Omit<Client, 'contactDate' | 'lastUpdate' | 'notes'> & {
  contactDate: string;
  lastUpdate: string;
  notes: StoredNote[];
};

// In-memory store, simulating a database with date strings.
// JSON.stringify converts Date objects to ISO strings, which mimics a real API response.
let clients: StoredClient[] = JSON.parse(JSON.stringify(INITIAL_CLIENTS));
let users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));

const FAKE_LATENCY = 300;

// Helper to convert a "stored" client (with date strings) to a "live" client (with Date objects).
const hydrateClient = (client: StoredClient): Client => ({
  ...client,
  contactDate: new Date(client.contactDate),
  lastUpdate: new Date(client.lastUpdate),
  notes: client.notes.map(note => ({ ...note, date: new Date(note.date) })),
});

// Helper to convert a "live" object to a "stored" object for simulation purposes.
const dehydrateNote = (note: Note): StoredNote => ({
    ...note,
    date: note.date.toISOString(),
});

const getImportedLeadIds = (): string[] => {
    const stored = localStorage.getItem('importedMetaLeadIds');
    return stored ? JSON.parse(stored) : [];
};

const addImportedLeadIds = (newIds: string[]): void => {
    const existingIds = getImportedLeadIds();
    const uniqueIds = Array.from(new Set([...existingIds, ...newIds]));
    localStorage.setItem('importedMetaLeadIds', JSON.stringify(uniqueIds));
};


export const crmService = {
  getUsers: async (): Promise<User[]> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    return JSON.parse(JSON.stringify(users));
  },
  
  addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
    };
    users.push(newUser);
    return JSON.parse(JSON.stringify(newUser));
  },

  updateUser: async (user: User): Promise<User> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    // Cannot change role of the main admin account
    if (user.id === 'user-1' && user.role !== 'Admin') {
        throw new Error("Cannot change the role of the main admin account.");
    }
    users[userIndex] = user;
    return JSON.parse(JSON.stringify(user));
  },

  deleteUser: async (userId: string): Promise<void> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    if (userId === 'user-1') {
      throw new Error('Cannot delete the main admin account.');
    }
    const isUserAssigned = clients.some(c => c.assignedTo === userId);
    if (isUserAssigned) {
      throw new Error('Cannot delete user. Please reassign their clients first.');
    }
    users = users.filter(u => u.id !== userId);
  },
    
  getClients: async (currentUser: User): Promise<Client[]> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    const userClients = currentUser.role === 'Admin' 
      ? clients 
      : clients.filter(c => c.assignedTo === currentUser.id);
    return userClients.map(hydrateClient);
  },

  getAllClients: async (): Promise<Client[]> => {
     await new Promise(res => setTimeout(res, FAKE_LATENCY));
     return clients.map(hydrateClient);
  },

  updateClientStatus: async (clientId: string, newStatus: ProcessStage, author: User): Promise<Client> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }
    const client = clients[clientIndex];
    client.status = newStatus;
    client.lastUpdate = new Date().toISOString();
    client.notes.push({
        id: `note-${Date.now()}`,
        date: new Date().toISOString(),
        text: `Status changed to "${newStatus}"`,
        author: author.name,
    });
    clients[clientIndex] = client;
    return hydrateClient({ ...client });
  },

  addClientFromMeta: async (leadData: { name: string, email: string, phone: string, leadId: string }): Promise<Client> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    
    // Prevent duplicate imports
    const importedIds = getImportedLeadIds();
    if (importedIds.includes(leadData.leadId)) {
        throw new Error(`Lead with ID ${leadData.leadId} has already been imported.`);
    }

    const advisors = users.filter(u => u.role === 'Advisor');
    if (advisors.length === 0) {
        throw new Error('No advisors available to assign the new lead.');
    }
    const assignedAdvisor = advisors[Math.floor(Math.random() * advisors.length)];
    const now = new Date();
    
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      service: 'Creación de Empresa LLC', // Default service
      status: ProcessStage.NewLead,
      contactDate: now,
      lastUpdate: now,
      assignedTo: assignedAdvisor.id,
      tags: ['Meta Lead'],
      notes: [
        { id: `note-${Date.now()}`, date: now, text: `Lead from Meta Ads (ID: ${leadData.leadId}). Awaiting first contact.`, author: 'System' },
      ],
    };
    
    // Dehydrate for storage to maintain store consistency
    const clientToStore: StoredClient = {
        ...newClient,
        contactDate: newClient.contactDate.toISOString(),
        lastUpdate: newClient.lastUpdate.toISOString(),
        notes: newClient.notes.map(dehydrateNote)
    };
    
    clients = [clientToStore, ...clients];
    addImportedLeadIds([leadData.leadId]); // Mark as imported
    
    return newClient; // Return the "live" object
  },
  
  addNote: async (clientId: string, noteText: string, author: User): Promise<Note> => {
    await new Promise(res => setTimeout(res, FAKE_LATENCY));
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      throw new Error('Client not found');
    }
    const newNote: Note = {
        id: `note-${Date.now()}`,
        date: new Date(),
        text: noteText,
        author: author.name,
    };
    
    clients[clientIndex].notes.push(dehydrateNote(newNote));
    clients[clientIndex].lastUpdate = newNote.date.toISOString();
    
    return newNote;
  }
};