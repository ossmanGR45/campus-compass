import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
}

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async (): Promise<ServiceCategory[]> => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useServiceCategory = (id: string | undefined) => {
  return useQuery({
    queryKey: ['service-category', id],
    queryFn: async (): Promise<ServiceCategory | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
