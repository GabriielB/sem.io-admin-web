"use client";
import * as React from "react";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/header";
import { useQuizService } from "@/services/quiz";

export default function QuizzesPage() {
  const quizSrv = useQuizService();
  const [quizzes, setQuizzes] = React.useState<any[]>([]);

  const buscarQuizzes = async () => {
    const dados = await quizSrv.buscarQuizzes();
    setQuizzes(dados);
  };

  const handleDeletarQuiz = async (quiz: any) => {
    if (confirm(`Deseja realmente excluir o quiz "${quiz.title}"?`)) {
      const retorno = await quizSrv.excluir(quiz.id);
      if (retorno.sucesso) {
        setQuizzes(await quizSrv.buscarQuizzes());
        alert("Quiz deletado");
      } else {
        alert("Erro ao excluir quiz");
      }
    }
  };

  React.useEffect(() => {
    buscarQuizzes();
  }, []);

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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
