
import type { Client, User } from './types';
import { ProcessStage, Role } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Admin', role: 'Admin', email: 'admin@globallaw.com' },
  { id: 'user-2', name: 'Ana García', role: 'Advisor', email: 'ana.garcia@globallaw.com', whatsapp: { number: '+15551234567', enabled: true } },
  { id: 'user-3', name: 'Carlos Ruiz', role: 'Advisor', email: 'carlos.ruiz@globallaw.com', whatsapp: { number: '+15557654321', enabled: false } },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Innovate Corp',
    email: 'contact@innovatecorp.com',
    phone: '555-0101',
    service: 'Creación de Empresa LLC',
    status: ProcessStage.NewLead,
    contactDate: new Date('2024-07-10T09:00:00Z'),
    lastUpdate: new Date('2024-07-10T09:00:00Z'),
    assignedTo: 'user-2',
    tags: ['Tech', 'High-Priority'],
    notes: [
      { id: 'note-1', date: new Date(), text: 'Lead from Meta Ads. Interested in Florida LLC.', author: 'System' },
    ],
  },
  {
    id: 'client-2',
    name: 'Garcia Consulting',
    email: 'info@garciaconsulting.net',
    phone: '555-0102',
    service: 'Servicio Contable',
    status: ProcessStage.Contacted,
    contactDate: new Date('2024-07-08T14:30:00Z'),
    lastUpdate: new Date('2024-07-09T11:00:00Z'),
    assignedTo: 'user-2',
    tags: ['Consulting'],
    notes: [
      { id: 'note-2', date: new Date('2024-07-09T11:00:00Z'), text: 'Initial call completed. Sent follow-up email with pricing.', author: 'Ana García' },
    ],
  },
  {
    id: 'client-3',
    name: 'Global Exports',
    email: 'sales@globalexports.io',
    phone: '555-0103',
    service: 'Creación de Empresa LLC',
    status: ProcessStage.ProposalSent,
    contactDate: new Date('2024-06-25T10:00:00Z'),
    lastUpdate: new Date('2024-07-05T16:00:00Z'),
    assignedTo: 'user-3',
    tags: ['Import/Export'],
    notes: [
      { id: 'note-3', date: new Date('2024-07-05T16:00:00Z'), text: 'Proposal sent. Follow up next week.', author: 'Carlos Ruiz' },
    ],
  },
  {
    id: 'client-4',
    name: 'Creative Solutions',
    email: 'hello@creativesolutions.dev',
    phone: '555-0104',
    service: 'Agente Registrado',
    status: ProcessStage.InProgress,
    contactDate: new Date('2024-05-15T11:00:00Z'),
    lastUpdate: new Date('2024-07-12T09:30:00Z'),
    assignedTo: 'user-3',
    tags: ['Design', 'Delaware'],
    notes: [
        { id: 'note-4', date: new Date('2024-07-12T09:30:00Z'), text: 'Documents submitted to the state. Awaiting confirmation.', author: 'Carlos Ruiz' },
    ],
  },
  {
    id: 'client-5',
    name: 'USA Market Access',
    email: 'contact@usamarket.com',
    phone: '555-0105',
    service: 'Creación de Empresa LLC',
    status: ProcessStage.ReadyForSignature,
    contactDate: new Date('2024-06-10T09:00:00Z'),
    lastUpdate: new Date('2024-07-11T14:00:00Z'),
    assignedTo: 'user-2',
    tags: [],
    notes: [
         { id: 'note-5', date: new Date('2024-07-11T14:00:00Z'), text: 'Final documents prepared and sent to client for electronic signature.', author: 'Ana García' },
    ],
  },
  {
    id: 'client-6',
    name: 'Tech Pioneers Inc.',
    email: 'founders@techpioneers.com',
    phone: '555-0106',
    service: 'Creación de Empresa LLC',
    status: ProcessStage.Completed,
    contactDate: new Date('2024-04-01T10:00:00Z'),
    lastUpdate: new Date('2024-06-15T12:00:00Z'),
    assignedTo: 'user-3',
    tags: ['Startup', 'Wyoming'],
    notes: [
        { id: 'note-6', date: new Date('2024-06-15T12:00:00Z'), text: 'Company formation complete. All documents delivered.', author: 'Carlos Ruiz' },
    ],
  },
];

export const PROCESS_STAGES_ORDER: ProcessStage[] = [
  ProcessStage.NewLead,
  ProcessStage.Contacted,
  ProcessStage.ProposalSent,
  ProcessStage.InProgress,
  ProcessStage.ReadyForSignature,
  ProcessStage.Completed,
];