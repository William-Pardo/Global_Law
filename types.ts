
export enum ProcessStage {
  NewLead = "Nuevo Lead",
  Contacted = "Contactado",
  ProposalSent = "Propuesta Enviada",
  InProgress = "En Proceso",
  ReadyForSignature = "Listo para Firma",
  Completed = "Completado",
}

export interface Note {
  id: string;
  date: Date;
  text: string;
  author: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: ProcessStage;
  contactDate: Date;
  lastUpdate: Date;
  assignedTo: string; // User ID
  tags: string[];
  notes: Note[];
}

export type Role = "Admin" | "Advisor";

export interface WhatsappContact {
    number: string;
    enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  whatsapp?: WhatsappContact;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationMessage {
  id: number;
  message: string;
  type: NotificationType;
}

// Meta Integration Types
export interface MetaUserProfile {
  id: string;
  name: string;
}

export interface MetaPage {
  id: string;
  name: string;
  access_token: string;
}

export interface MetaForm {
  id: string;
  name: string;
  status: string;
}

export interface MetaLeadFieldData {
    name: string;
    values: string[];
}
export interface MetaLead {
    id:string;
    created_time: string;
    field_data: MetaLeadFieldData[];
}