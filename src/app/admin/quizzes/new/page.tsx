"use client";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useQuizService } from "@/services/quiz";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";

export default function QuizNewPage() {
  const quizSrv = useQuizService();
  const router = useRouter();
  const [mensagem, setMensagem] = useState<null | boolean>(null);

  const handleSalvar = async (formData: any) => {
    setMensagem(null);

    const quiz = {
      title: formData.title,
      category: formData.category,
      cover_image: formData.coverImage,
    };

    console.log("Enviando para o Supabase:", quiz);

    const retorno = await quizSrv.cadastrar(quiz);
    setMensagem(retorno.sucesso);

    if (retorno.sucesso) {
      router.push("/admin/quizzes");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Cadastrar Quiz" />
      <h6>Formulário</h6>

      {mensagem === false && (
        <p className="alert alert-danger">Não foi possível cadastrar o quiz</p>
      )}
      {mensagem === true && (
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
                {/* Título */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Título</label>
                    <Field className="form-control" type="text" name="title" />
                  </div>
                </div>

                {/* Categoria */}
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

                {/* Upload da imagem */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Imagem de Capa</label>
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

                {/* Botão */}
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
