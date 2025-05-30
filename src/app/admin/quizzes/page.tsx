"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/header";
import { useQuizService } from "@/services/quiz";
import { useRouter } from "next/navigation";

export default function QuizzesPage() {
  const quizSrv = useQuizService();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const dados = await quizSrv.buscarQuizzes();
      setQuizzes(dados);
      setCarregando(false);
    };

    carregar();
  }, [quizSrv]);

  const handleDeletarQuiz = async (quiz: any) => {
    const confirmacao = confirm(
      `Deseja realmente excluir o quiz "${quiz.title}"?`
    );
    if (!confirmacao) return;

    const retorno = await quizSrv.excluir(quiz.id);
    if (retorno.sucesso) {
      const dados = await quizSrv.buscarQuizzes();
      setQuizzes(dados);
      alert("Quiz deletado");
    } else {
      alert("Erro ao excluir quiz");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Lista de Quizzes">
        <Link href="/admin/quizzes/new" className="btn btn-primary">
          Novo Quiz
        </Link>
      </AdminHeader>

      <div className="card shadow-lg border-0 rounded-4 p-3">
        <div className="card-header bg-white border-0 pb-3">
          <h5 className="text-dark fw-bold mb-0">Quizzes</h5>
        </div>

        <div className="card-body p-0">
          {carregando ? (
            <p className="text-center text-muted py-4">Carregando quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nenhum quiz encontrado.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-gradient-info d-flex align-items-center justify-content-center me-3"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="ni ni-hat-3 text-white fs-6"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{quiz.title}</h6>
                      <p className="mb-0 text-muted small">{quiz.category}</p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <Link
                      href={`/admin/quizzes/${quiz.id}`}
                      className="btn btn-sm btn-outline-dark me-2 rounded-pill d-flex align-items-center"
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-ruler-pencil me-1"></i> Editar
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger me-2 rounded-pill d-flex align-items-center"
                      onClick={() => handleDeletarQuiz(quiz)}
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-fat-remove me-1"></i> Excluir
                    </button>

                    <button
                      className="btn btn-sm btn-outline-info rounded-pill d-flex align-items-center"
                      onClick={() =>
                        router.push(`/admin/quizzes/${quiz.id}/questions`)
                      }
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-bullet-list-67 me-1"></i> Perguntas
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
