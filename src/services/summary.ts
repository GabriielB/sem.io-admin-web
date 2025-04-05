import { supabase } from "@/config/supabase";

const SummaryService = {
  listar: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar resumos:", error.message);
      return [];
    }

    return data || [];
  },

  buscar: async (id: string): Promise<any | null> => {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar resumo:", error.message);
      return null;
    }

    return data;
  },

  cadastrar: async (resumo: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("summaries").insert(resumo);

    if (error) {
      console.error("Erro ao cadastrar resumo:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  atualizar: async (id: string, resumo: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase
      .from("summaries")
      .update(resumo)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar resumo:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  excluir: async (id: string): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("summaries").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir resumo:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },
};

export const useSummaryService = () => SummaryService;
