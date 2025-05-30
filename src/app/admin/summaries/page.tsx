"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/header";
import { useSummaryService } from "@/services/summary";

export default function SummariesPage() {
  const summaryService = useSummaryService();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarResumos = async () => {
    setCarregando(true);
    const dados = await summaryService.listar();
    setSummaries(dados);
    setCarregando(false);
  };

  const handleExcluirResumo = async (id: string) => {
    const confirmar = confirm("Deseja realmente excluir este resumo?");
    if (!confirmar) return;

    const retorno = await summaryService.excluir(id);
    if (retorno.sucesso) {
      const novos = await summaryService.listar();
      setSummaries(novos);
      alert("Resumo excluído com sucesso!");
    } else {
      alert("Erro ao excluir resumo.");
    }
  };

  useEffect(() => {
    carregarResumos();
  }, []);

  return (
    <main>
      <AdminHeader titulo="Lista de Resumos">
        <Link href="/admin/summaries/new" className="btn btn-primary">
          Novo Resumo
        </Link>
      </AdminHeader>

      <div className="card shadow-lg border-0 rounded-4 p-3">
        <div className="card-header bg-white border-0 pb-3">
          <h5 className="text-dark fw-bold mb-0">Resumos</h5>
        </div>

        <div className="card-body p-0">
          {carregando ? (
            <p className="text-center text-muted py-4">Carregando resumos...</p>
          ) : summaries.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nenhum resumo cadastrado ainda.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {summaries.map((summary) => (
                <div
                  key={summary.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-gradient-success d-flex align-items-center justify-content-center me-3"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="ni ni-single-copy-04 text-white fs-6"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{summary.title}</h6>
                      <p className="mb-0 text-muted small">
                        {summary.category}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <Link
                      href={`/admin/summaries/${summary.id}`}
                      className="btn btn-sm btn-outline-dark me-2 rounded-pill d-flex align-items-center"
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-ruler-pencil me-1"></i> Editar
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center"
                      onClick={() => handleExcluirResumo(summary.id)}
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
