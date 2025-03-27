"use client";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { AdminHeader } from "../../components";
import { useUsuarioService } from "../../../../services/usuario";

export default function UsuarioEditarPage() {
  const usuariosSrv = useUsuarioService();
  const [mensagem, setMensagem] = useState<null | boolean>(null);

  const handleSalvar = async (usuario: any) => {
    setMensagem(null);

    const novoUsuario = {
      email: usuario.email,
      senha: usuario.senha,
      username: usuario.username,
    };

    const retorno = await usuariosSrv.cadastrar(novoUsuario);
    setMensagem(retorno.sucesso);
  };

  return (
    <main>
      <AdminHeader titulo="Cadastrar Usuário" />
      <h6>Formulário</h6>

      {mensagem === false && (
        <p className="alert alert-danger">Não foi possível cadastrar usuário</p>
      )}
      {mensagem === true && (
        <p className="alert alert-success">Cadastrado com sucesso</p>
      )}

      <Formik
        initialValues={{ username: "", email: "", senha: "" }}
        onSubmit={handleSalvar}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="card-body">
              <div className="row">
                {/* USERNAME */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Username</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="username"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Email</label>
                    <Field className="form-control" type="email" name="email" />
                  </div>
                </div>

                {/* SENHA */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Senha</label>
                    <Field
                      className="form-control"
                      type="password"
                      name="senha"
                    />
                  </div>
                </div>

                {/* BOTÃO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      className="btn btn-primary w-100"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
