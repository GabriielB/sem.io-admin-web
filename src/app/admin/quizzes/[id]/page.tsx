"use client";
import { useEffect, useState } from "react";
import { useQuizService } from "@/services/quiz";
import { Field, Form, Formik } from "formik";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";

export default function EditQuizPage() {
  const quizSrv = useQuizService();
  const router = useRouter();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      const quizData = await quizSrv.buscar(id as string);
      if (quizData) {
        setInitialValues({
          title: quizData.title || "",
          category: quizData.category || "",
          coverImage: quizData.cover_image || "",
        });
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [id, quizSrv]);

  if (loading) {
    return (
      <main>
        <AdminHeader titulo="Editar Quiz" />
        <p className="text-center mt-4">Carregando dados do quiz...</p>
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
          const retorno = await quizSrv.atualizar(id as string, {
            title: values.title,
            category: values.category,
            cover_image: values.coverImage,
          });

          setSubmitting(false);

          if (retorno.sucesso) {
            router.push("/admin/quizzes");
          } else {
            alert("Erro ao atualizar quiz.");
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="card-body">
              <div className="row">
                {/* título */}
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
                    {values.coverImage && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={values.coverImage}
                          alt="Imagem atual"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
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
