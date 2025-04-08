import { supabase } from "@/config/supabase";

const MindmapService = {
  /**
   * Lista todos os mapas mentais.
   */
  listar: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from("mindmaps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar mapas mentais:", error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Busca um mapa mental pelo ID.
   */
  buscar: async (id: string): Promise<any | null> => {
    const { data, error } = await supabase
      .from("mindmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar mapa mental:", error.message);
      return null;
    }

    return data;
  },

  /**
   * Cadastra um novo mapa mental.
   */
  cadastrar: async (mapa: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("mindmaps").insert(mapa);

    if (error) {
      console.error("Erro ao cadastrar mapa mental:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * Atualiza um mapa mental existente.
   */
  atualizar: async (id: string, mapa: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("mindmaps").update(mapa).eq("id", id);

    if (error) {
      console.error("Erro ao atualizar mapa mental:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * Exclui um mapa mental.
   */
  excluir: async (id: string): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("mindmaps").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir mapa mental:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },
};

export const useMindmapService = () => MindmapService;
