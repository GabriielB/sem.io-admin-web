import { supabase } from "@/config/supabase";

const QuestionService = {
  /**
   * lista todas as perguntas de um quiz específico.
   */
  buscar: async (id: string): Promise<any | null> => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar pergunta:", error.message);
      return null;
    }

    return data;
  },

  /**
   * lista todas as perguntas de um quiz específico.
   */
  listarPorQuiz: async (quizId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao listar perguntas:", error.message);
      return [];
    }

    return data || [];
  },
  /**
   * cadastra uma nova pergunta.
   */
  cadastrar: async (pergunta: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("questions").insert(pergunta);

    if (error) {
      console.error("Erro ao cadastrar pergunta:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * atualiza uma pergunta existente.
   */
  atualizar: async (
    id: string,
    pergunta: any
  ): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase
      .from("questions")
      .update(pergunta)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar pergunta:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * remove uma pergunta.
   */
  excluir: async (id: string): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir pergunta:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },
};

export const useQuestionService = () => QuestionService;
