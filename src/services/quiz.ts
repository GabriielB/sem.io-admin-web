import { supabase } from "@/config/supabase";

const QuizService = {
  /**
   * cadastrar quiz
   * @param quiz Objeto contendo title, category e coverImage.
   * @returns {sucesso: boolean}
   */
  cadastrar: async (quiz: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.rpc("create_quiz", {
      title_input: quiz.title,
      category_input: quiz.category,
      cover_image_input: quiz.cover_image,
    });

    if (error) {
      console.error("Erro ao cadastrar quiz:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * buscar pelo id
   * @param id
   * @returns Dados do quiz ou null.
   */
  buscar: async (id: string): Promise<any> => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar quiz:", error.message);
      return null;
    }

    return data;
  },

  /**
   * func para listar todos os quizzes
   * @returns Array de quizzes.
   */
  buscarQuizzes: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar quizzes:", error.message);
      return [];
    }

    return data || [];
  },

  /**
   * atualizar quizz existente
   * @param id string - ID do quiz.
   * @param quiz Objeto com os novos dados.
   * @returns {sucesso: boolean}
   */
  atualizar: async (id: string, quiz: any): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.rpc("update_quiz", {
      quiz_id: id,
      new_title: quiz.title,
      new_category: quiz.category,
      new_cover_image: quiz.cover_image,
    });

    if (error) {
      console.error("Erro ao atualizar quiz:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },

  /**
   * func para excluir o quizz
   * @param id
   * @returns {sucesso: boolean}
   */
  excluir: async (id: string): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.rpc("delete_quiz", { quiz_id: id });

    if (error) {
      console.error("Erro ao excluir quiz:", error.message);
      return { sucesso: false };
    }

    return { sucesso: true };
  },
};

export const useQuizService = () => QuizService;
