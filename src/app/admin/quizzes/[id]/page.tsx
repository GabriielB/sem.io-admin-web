"use client";
import * as React from "react";
import { useQuizService } from "@/services/quiz";
import { Field, Form, Formik } from "formik";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/app/admin/components/header";

export default function EditQuizPage() {
  const quizSrv = useQuizService();
  const router = useRouter();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    category: "",
    coverImage: "",
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    async function fetchQuiz() {
      const quizData = await quizSrv.buscar(id as string);
      if (quizData) {
        setInitialValues({
          title: quizData.title || "",
          category: quizData.category || "",
          coverImage: quizData.coverImage || "",
        });
      }
      setLoading(false);
    }
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <main>
        <AdminHeader titulo="Editar Quiz" />
        <p>Carregando dados do quiz...</p>
      </main>
    );
  }

  return (
    <main>
      <AdminHeader titulo="Editar Quiz" />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          const retorno = await quizSrv.atualizar(id as string, values);
          setSubmitting(false);
          if (retorno.sucesso) {
            router.push("/admin/quizzes");
          } else {
            alert("Erro ao atualizar quiz.");
          }
        }}
      >
        {({ isSubmitting }) => (
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

                {/* imagem */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">
                      URL da Imagem de Capa
                    </label>
                    <Field
                      className="form-control"
                      type="text"
                      name="coverImage"
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
                      Salvar Alterações
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
