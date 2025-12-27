import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category_id: string | null;
  tags: string[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
}

export const useFAQs = (categoryId?: string) => {
  return useQuery({
    queryKey: ['faqs', categoryId],
    queryFn: async (): Promise<FAQ[]> => {
      let query = supabase
        .from('faqs')
        .select(`
          *,
          category:service_categories(id, name, icon, color)
        `)
        .order('helpful_count', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

export const useSearchFAQs = (searchQuery: string) => {
  return useQuery({
    queryKey: ['faqs-search', searchQuery],
    queryFn: async (): Promise<FAQ[]> => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from('faqs')
        .select(`
          *,
          category:service_categories(id, name, icon, color)
        `)
        .or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`)
        .order('helpful_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length > 2,
  });
};

export const useIncrementHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqId: string) => {
      const { data: currentFaq } = await supabase
        .from('faqs')
        .select('helpful_count')
        .eq('id', faqId)
        .single();

      const { error } = await supabase
        .from('faqs')
        .update({ helpful_count: (currentFaq?.helpful_count || 0) + 1 })
        .eq('id', faqId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};
