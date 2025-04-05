"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/header";
import { useQuestionService } from "@/services/question";

export default function QuestionsPage() {
  const { id } = useParams(); // quiz_id
  const questionSrv = useQuestionService();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPerguntas = async () => {
    const dados = await questionSrv.listarPorQuiz(id as string);
    setQuestions(dados || []);
    setLoading(false);
  };

  const handleExcluirPergunta = async (questionId: string) => {
    const confirmar = confirm("Deseja realmente excluir esta pergunta?");
    if (!confirmar) return;

    const retorno = await questionSrv.excluir(questionId);
    if (retorno.sucesso) {
      await carregarPerguntas();
      alert("Pergunta excluída com sucesso!");
    } else {
      alert("Erro ao excluir pergunta.");
    }
  };

  useEffect(() => {
    setLoading(true);
    carregarPerguntas();
  }, [id]);

  return (
    <main>
      <AdminHeader titulo="Perguntas do Quiz">
        <Link
          href={`/admin/quizzes/${id}/questions/new`}
          className="btn btn-primary"
        >
          Nova Pergunta
        </Link>
      </AdminHeader>

      <div className="card-header pb-0">
        <h6>Perguntas</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        {loading ? (
          <p className="text-center">Carregando perguntas...</p>
        ) : questions.length === 0 ? (
          <p className="text-center">Nenhuma pergunta cadastrada ainda.</p>
        ) : (
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Qtd. Opções</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.description}</td>
                    <td>{q.options?.length || 0}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Link
                          href={`/admin/quizzes/${id}/questions/${q.id}`}
                          className="text-primary font-weight-bold text-xs"
                        >
                          Editar
                        </Link>
                        <p
                          className="text-danger font-weight-bold text-xs mb-0"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleExcluirPergunta(q.id)}
                        >
                          Excluir
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
