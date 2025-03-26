"use client";
import * as React from "react";
import { useQuizService } from "@/services/quiz";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload"; // Importe o componente de upload

export default function QuizNewPage() {
  const quizSrv = useQuizService();
  const [mensagem, setMensagem] = React.useState<null | boolean>(null);
  const router = useRouter();

  const handleSalvar = async (quiz: any) => {
    setMensagem(null);
    const retorno = await quizSrv.cadastrar(quiz);
    setMensagem(retorno.sucesso);
    if (retorno.sucesso) router.push("/admin/quizzes");
  };

  return (
    <main>
      <AdminHeader titulo="Cadastrar Quiz" />
      <h6>Formulário</h6>

      {mensagem !== null && mensagem === false && (
        <p className="alert alert-danger">Não foi possível cadastrar o quiz</p>
      )}
      {mensagem !== null && mensagem === true && (
        <p className="alert alert-success">Quiz cadastrado com sucesso</p>
      )}

      <Formik
        initialValues={{ title: "", category: "", coverImage: "" }}
        onSubmit={handleSalvar}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="card-body">
              <div className="row">
                {/* titulo */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Título</label>
                    <Field className="form-control" type="text" name="title" />
                  </div>
                </div>

                {/* categoria */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Categoria</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="category"
                    />
                  </div>
                </div>

                {/* upload da imagem */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Imagem de Capa</label>
                    {/* Mostra a imagem se já estiver carregada */}
                    {values.coverImage && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={values.coverImage}
                          alt="Capa do Quiz"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    )}
                    <FileUpload
                      onUpload={(url: string) =>
                        setFieldValue("coverImage", url)
                      }
                    />
                  </div>
                </div>

                {/* botão */}
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
