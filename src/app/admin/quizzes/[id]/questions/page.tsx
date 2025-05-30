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

      <div className="card shadow-lg border-0 rounded-4 p-3">
        <div className="card-header bg-white border-0 pb-3">
          <h5 className="text-dark fw-bold mb-0">Perguntas</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <p className="text-center text-muted py-4">
              Carregando perguntas...
            </p>
          ) : questions.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nenhuma pergunta cadastrada ainda.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-gradient-warning d-flex align-items-center justify-content-center me-3"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="ni ni-bullet-list-67 text-white fs-6"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{q.description}</h6>
                      <p className="mb-0 text-muted small">
                        {q.options?.length || 0} opção
                        {q.options?.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <Link
                      href={`/admin/quizzes/${id}/questions/${q.id}`}
                      className="btn btn-sm btn-outline-dark me-2 rounded-pill d-flex align-items-center"
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-ruler-pencil me-1"></i> Editar
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center"
                      onClick={() => handleExcluirPergunta(q.id)}
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-fat-remove me-1"></i> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
