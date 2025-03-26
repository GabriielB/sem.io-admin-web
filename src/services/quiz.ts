// services/quizService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const QuizService = {
  /**
   * Cadastra um novo quiz.
   * @param quiz Objeto contendo title, category, coverImage e (opcionalmente) questions.
   * @returns {sucesso: boolean}
   */
  cadastrar: async (quiz: any): Promise<{ sucesso: boolean }> => {
    return addDoc(collection(db, "quizzes"), {
      title: quiz.title,
      category: quiz.category,
      coverImage: quiz.coverImage,
      questions: quiz.questions || [],
      createdAt: serverTimestamp(),
    })
      .then(() => ({ sucesso: true }))
      .catch((erro) => {
        console.error("Erro ao cadastrar quiz:", erro);
        return { sucesso: false };
      });
  },

  /**
   * Busca um quiz pelo ID.
   * @param id string - ID do quiz.
   * @returns Dados do quiz ou null.
   */
  buscar: async (id: string): Promise<any> => {
    return getDoc(doc(db, "quizzes", id))
      .then((retorno) => (retorno.exists() ? retorno.data() : null))
      .catch((erro) => {
        console.error("Erro ao buscar quiz:", erro);
        return null;
      });
  },

  /**
   * Lista todos os quizzes.
   * @returns Array de quizzes.
   */
  buscarQuizzes: async (): Promise<any[]> => {
    return getDocs(collection(db, "quizzes"))
      .then((snapshots) => {
        const retorno: any[] = [];
        snapshots.forEach((snap) => {
          retorno.push({ id: snap.id, ...snap.data() });
        });
        return retorno;
      })
      .catch((erro) => {
        console.error("Erro ao buscar quizzes:", erro);
        return [];
      });
  },

  /**
   * Atualiza os dados de um quiz existente.
   * @param id string - ID do quiz.
   * @param quiz Objeto com os novos dados.
   * @returns {sucesso: boolean}
   */
  atualizar: async (id: string, quiz: any): Promise<{ sucesso: boolean }> => {
    return updateDoc(doc(db, "quizzes", id), {
      title: quiz.title,
      category: quiz.category,
      coverImage: quiz.coverImage,
      questions: quiz.questions || [],
      updatedAt: serverTimestamp(),
    })
      .then(() => ({ sucesso: true }))
      .catch((erro) => {
        console.error("Erro ao atualizar quiz:", erro);
        return { sucesso: false };
      });
  },

  /**
   * Exclui um quiz.
   * @param id string - ID do quiz.
   * @returns {sucesso: boolean}
   */
  excluir: async (id: string): Promise<{ sucesso: boolean }> => {
    return deleteDoc(doc(db, "quizzes", id))
      .then(() => ({ sucesso: true }))
      .catch((erro) => {
        console.error("Erro ao excluir quiz:", erro);
        return { sucesso: false };
      });
  },
};

export const useQuizService = () => QuizService;
