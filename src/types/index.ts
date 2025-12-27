export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'it-support' | 'registration' | 'library' | 'financial-aid' | 'housing' | 'general';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: TicketCategory;
  tags: string[];
  helpful: number;
  views: number;
}

export interface ServiceCategory {
  id: TicketCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: FAQ[];
}
