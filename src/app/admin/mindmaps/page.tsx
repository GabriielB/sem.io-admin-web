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

      <div className="card-header pb-0">
        <h6>Mapas Mentais</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : mindmaps.length === 0 ? (
          <p className="text-center">Nenhum mapa mental cadastrado ainda.</p>
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
                {mindmaps.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.category}</td>
                    <td className="d-flex gap-3">
                      <Link
                        href={`/admin/mindmaps/${m.id}`}
                        className="text-primary font-weight-bold text-xs"
                      >
                        Editar
                      </Link>
                      <p
                        className="text-danger font-weight-bold text-xs"
                        style={{ cursor: "pointer", marginBottom: 0 }}
                        onClick={() => handleExcluir(m.id)}
                      >
                        Excluir
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
