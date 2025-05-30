"use client";
import { useEffect, useState } from "react";
import AdminHeader from "../components/header";
import { useQuizService } from "@/services/quiz";
import { useSummaryService } from "@/services/summary";
import { useUsuarioService } from "@/services/usuario";
import { useMindmapService } from "@/services/mindmap";

export default function DashboardPage() {
  const quizSrv = useQuizService();
  const summarySrv = useSummaryService();
  const userSrv = useUsuarioService();
  const mindmapSrv = useMindmapService();

  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalSummaries, setTotalSummaries] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMindmaps, setTotalMindmaps] = useState(0);

  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [recentSummaries, setRecentSummaries] = useState<any[]>([]);
  const [recentMindmaps, setRecentMindmaps] = useState<any[]>([]);

  useEffect(() => {
    const carregar = async () => {
      const quizzes = await quizSrv.buscarQuizzes();
      const summaries = await summarySrv.listar();
      const users = await userSrv.buscarUsuarios();
      const mindmaps = await mindmapSrv.listar();

      setTotalQuizzes(quizzes.length);
      setTotalSummaries(summaries.length);
      setTotalUsers(users.length);
      setTotalMindmaps(mindmaps.length);

      setRecentQuizzes(quizzes.slice(0, 5));
      setRecentSummaries(summaries.slice(0, 5));
      setRecentMindmaps(mindmaps.slice(0, 5));
    };

    carregar();
  }, []);

  return (
    <main>
      <AdminHeader titulo="Dashboard" />

      <div className="row mt-4">
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-gradient-info shadow">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="ni ni-hat-3 text-white text-lg"></i>
              </div>
              <div>
                <h6 className="mb-0">Total de Quizzes</h6>
                <h3 className="mb-0">{totalQuizzes}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-white bg-gradient-success shadow">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="ni ni-single-copy-04 text-white text-lg"></i>
              </div>
              <div>
                <h6 className="mb-0">Total de Resumos</h6>
                <h3 className="mb-0">{totalSummaries}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-white bg-gradient-warning shadow">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="ni ni-circle-08 text-white text-lg"></i>
              </div>
              <div>
                <h6 className="mb-0">Total de Usuários</h6>
                <h3 className="mb-0">{totalUsers}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-white bg-gradient-primary shadow">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="ni ni-map-big text-white text-lg"></i>
              </div>
              <div>
                <h6 className="mb-0">Total de Mapas Mentais</h6>
                <h3 className="mb-0">{totalMindmaps}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos dados */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Últimos Quizzes Criados</h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentQuizzes.map((quiz) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={quiz.id}
                  >
                    <div className="d-flex align-items-center">
                      <i className="ni ni-hat-3 text-info me-3"></i>
                      <div>
                        <strong>{quiz.title}</strong>
                        <p className="mb-0 text-muted small">{quiz.category}</p>
                      </div>
                    </div>
                    <span className="text-muted small">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Últimos Resumos Cadastrados</h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentSummaries.map((summary) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={summary.id}
                  >
                    <div className="d-flex align-items-center">
                      <i className="ni ni-single-copy-04 text-success me-3"></i>
                      <div>
                        <strong>{summary.title}</strong>
                        <p className="mb-0 text-muted small">
                          {summary.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-muted small">
                      {new Date(summary.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Últimos Mapas Mentais</h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentMindmaps.map((mapa) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={mapa.id}
                  >
                    <div className="d-flex align-items-center">
                      <i className="ni ni-map-big text-primary me-3"></i>
                      <div>
                        <strong>{mapa.title}</strong>
                        <p className="mb-0 text-muted small">{mapa.category}</p>
                      </div>
                    </div>
                    <span className="text-muted small">
                      {new Date(mapa.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
