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

      <div className="card-header pb-0">
        <h6>Usuários</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        {carregando ? (
          <p className="text-center">Carregando usuários...</p>
        ) : (
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Usuário
                  </th>
                  <th className="text-secondary opacity-7"></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">{usuario.username}</h6>
                          <p className="text-xs text-secondary mb-0">
                            {usuario.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      <p
                        className="text-secondary font-weight-bold text-xs"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleResetarSenha(usuario)}
                      >
                        Resetar senha
                      </p>
                      <p
                        className="text-danger font-weight-bold text-xs"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeletarConta(usuario)}
                      >
                        Excluir conta
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
