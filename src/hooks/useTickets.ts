import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category_id: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  creator_name?: string | null;
  assignee_name?: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  sender_name?: string | null;
}

export const useTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tickets', user?.id, user?.role],
    queryFn: async (): Promise<Ticket[]> => {
      // First get tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          category:service_categories(id, name, icon, color)
        `)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      if (!tickets) return [];

      // Get unique user IDs for creators and assignees
      const userIds = [...new Set([
        ...tickets.map(t => t.created_by),
        ...tickets.filter(t => t.assigned_to).map(t => t.assigned_to!)
      ])];

      // Fetch profiles for these users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return tickets.map(ticket => ({
        ...ticket,
        creator_name: profileMap.get(ticket.created_by) || null,
        assignee_name: ticket.assigned_to ? profileMap.get(ticket.assigned_to) || null : null,
      }));
    },
    enabled: !!user,
  });
};

export const useTicket = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async (): Promise<Ticket | null> => {
      if (!ticketId) return null;

      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          category:service_categories(id, name, icon, color)
        `)
        .eq('id', ticketId)
        .maybeSingle();

      if (error) throw error;
      if (!ticket) return null;

      // Fetch creator and assignee names
      const userIds = [ticket.created_by, ticket.assigned_to].filter(Boolean) as string[];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return {
        ...ticket,
        creator_name: profileMap.get(ticket.created_by) || null,
        assignee_name: ticket.assigned_to ? profileMap.get(ticket.assigned_to) || null : null,
      };
    },
    enabled: !!ticketId,
  });
};

export const useTicketMessages = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async (): Promise<TicketMessage[]> => {
      if (!ticketId) return [];

      const { data: messages, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!messages) return [];

      // Fetch sender names
      const senderIds = [...new Set(messages.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return messages.map(message => ({
        ...message,
        sender_name: profileMap.get(message.sender_id) || null,
      }));
    },
    enabled: !!ticketId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticket: {
      subject: string;
      description: string;
      category_id: string;
      priority: TicketPriority;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticket,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: TicketStatus }) => {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, content, isInternal = false }: { 
      ticketId: string; 
      content: string; 
      isInternal?: boolean;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content,
          is_internal: isInternal,
        });

      if (error) throw error;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
    },
  });
};
