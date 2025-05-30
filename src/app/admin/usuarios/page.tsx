"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "../components";
import { useUsuarioService } from "../../../services/usuario";

export default function UsuariosPage() {
  const usuariosSrv = useUsuarioService();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregando(true);
      const lista = await usuariosSrv.buscarUsuarios();
      setUsuarios(lista);
      setCarregando(false);
    };

    carregarUsuarios();
  }, [usuariosSrv]);

  const handleResetarSenha = async (usuario: any) => {
    const retorno = await usuariosSrv.recuperarSenha(usuario.email);
    alert(retorno.sucesso ? "Email enviado" : "Conta não encontrada");
  };

  const handleDeletarConta = async (usuario: any) => {
    const confirmar = confirm(
      `Deseja realmente excluir a conta de ${usuario.username} (${usuario.email})?`
    );

    if (!confirmar) return;

    const retorno = await usuariosSrv.excluir(usuario);
    if (retorno.sucesso) {
      const lista = await usuariosSrv.buscarUsuarios();
      setUsuarios(lista);
      alert("Conta deletada");
    } else {
      alert("Conta não encontrada");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Lista de Usuários">
        <Link className="btn btn-primary" href="/admin/usuarios/editar">
          Novo usuário
        </Link>
      </AdminHeader>

      <div className="card shadow-lg border-0 rounded-4 p-3">
        <div className="card-header bg-white border-0 pb-3">
          <h5 className="text-dark fw-bold mb-0">Usuários Cadastrados</h5>
        </div>

        <div className="card-body p-0">
          {carregando ? (
            <p className="text-center text-muted py-4">
              Carregando usuários...
            </p>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-muted py-4">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="ni ni-single-02 text-white fs-6"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">{usuario.username}</h6>
                      <p className="mb-0 text-muted small">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-outline-dark me-2 rounded-pill d-flex align-items-center"
                      onClick={() => handleResetarSenha(usuario)}
                      style={{ transition: "all 0.2s" }}
                    >
                      <i className="ni ni-lock-circle-open me-1"></i> Resetar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center"
                      onClick={() => handleDeletarConta(usuario)}
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
