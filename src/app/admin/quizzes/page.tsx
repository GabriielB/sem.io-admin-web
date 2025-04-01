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

      <div className="card-header pb-0">
        <h6>Quizzes</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        {carregando ? (
          <p className="text-center">Carregando quizzes...</p>
        ) : (
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Quiz
                  </th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Categoria
                  </th>
                  <th className="text-secondary opacity-7"></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">{quiz.title}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-xs text-secondary mb-0">
                        {quiz.category}
                      </p>
                    </td>
                    <td className="align-middle">
                      <Link href={`/admin/quizzes/${quiz.id}`}>
                        <p
                          className="text-secondary font-weight-bold text-xs"
                          style={{ cursor: "pointer" }}
                        >
                          Editar
                        </p>
                      </Link>
                      <p
                        className="text-danger font-weight-bold text-xs"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeletarQuiz(quiz)}
                      >
                        Excluir
                      </p>
                      <p
                        className="text-info font-weight-bold text-xs"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/quizzes/${quiz.id}/questions`)
                        }
                      >
                        Gerenciar Perguntas
                      </p>
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
