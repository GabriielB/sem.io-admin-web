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

      <div className="card-header pb-0">
        <h6>Resumos</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        {carregando ? (
          <p className="text-center">Carregando resumos...</p>
        ) : summaries.length === 0 ? (
          <p className="text-center">Nenhum resumo cadastrado ainda.</p>
        ) : (
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((summary) => (
                  <tr key={summary.id}>
                    <td>{summary.title}</td>
                    <td>{summary.category}</td>
                    <td>
                      <div className="d-flex gap-3 align-items-center">
                        <Link
                          href={`/admin/summaries/${summary.id}`}
                          className="text-primary font-weight-bold text-xs"
                        >
                          Editar
                        </Link>
                        <p
                          className="text-danger font-weight-bold text-xs mb-0"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleExcluirResumo(summary.id)}
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
