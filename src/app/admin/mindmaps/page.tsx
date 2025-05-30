"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/app/admin/components/header";
import { useMindmapService } from "@/services/mindmap";

export default function MindmapsPage() {
  const mindmapService = useMindmapService();
  const [mindmaps, setMindmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const dados = await mindmapService.listar();
    setMindmaps(dados);
    setLoading(false);
  };

  const handleExcluir = async (id: string) => {
    const confirmar = confirm("Deseja realmente excluir este mapa mental?");
    if (!confirmar) return;

    const retorno = await mindmapService.excluir(id);
    if (retorno.sucesso) {
      await carregar();
      alert("Mapa mental excluído com sucesso!");
    } else {
      alert("Erro ao excluir.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <main>
      <AdminHeader titulo="Mapas Mentais">
        <Link href="/admin/mindmaps/new" className="btn btn-primary">
          Novo Mapa Mental
        </Link>
      </AdminHeader>

      <div className="card shadow-lg border-0 rounded-4 p-3">
        <div className="card-header bg-white border-0 pb-3">
          <h5 className="text-dark fw-bold mb-0">Mapas Mentais</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <p className="text-center text-muted py-4">Carregando...</p>
          ) : mindmaps.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nenhum mapa mental cadastrado ainda.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {mindmaps.map((m) => (
                <div
                  key={m.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="ni ni-map-big text-white fs-6"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{m.title}</h6>
                      <p className="mb-0 text-muted small">{m.category}</p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <Link
                      href={`/admin/mindmaps/${m.id}`}
                      className="btn btn-sm btn-outline-dark me-2 rounded-pill d-flex align-items-center"
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-ruler-pencil me-1"></i> Editar
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center"
                      onClick={() => handleExcluir(m.id)}
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
