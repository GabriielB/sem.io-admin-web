"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, Field, FieldArray } from "formik";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { useQuestionService } from "@/services/question";

export default function EditQuestionPage() {
  const { questionId, quizId } = useParams();
  const router = useRouter();
  const questionSrv = useQuestionService();

  const [initialValues, setInitialValues] = useState({
    description: "",
    media: "",
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const dados = await questionSrv.buscar(questionId as string);

      if (dados) {
        setInitialValues({
          description: dados.description || "",
          media: dados.media || "",
          options:
            dados.options && dados.options.length === 4
              ? dados.options
              : [
                  { text: "", correct: false },
                  { text: "", correct: false },
                  { text: "", correct: false },
                  { text: "", correct: false },
                ],
        });
      }
      setLoading(false);
    };

    carregar();
  }, [questionId]);

  return (
    <main>
      <AdminHeader titulo="Editar Pergunta" />
      {loading ? (
        <p className="text-center mt-4">Carregando pergunta...</p>
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            const payload = {
              ...values,
              quiz_id: quizId,
            };

            const retorno = await questionSrv.atualizar(
              questionId as string,
              payload
            );

            setSubmitting(false);
            if (retorno.sucesso) {
              router.push(`/admin/quizzes/${quizId}/questions`);
            } else {
              alert("Erro ao atualizar pergunta.");
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="card-body">
                <div className="form-group">
                  <label>Descrição da Pergunta</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control"
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Imagem (opcional)</label>
                  {values.media && (
                    <div style={{ marginBottom: "10px" }}>
                      <img
                        src={values.media}
                        alt="Imagem da pergunta"
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                  <FileUpload
                    onUpload={(url: string) => setFieldValue("media", url)}
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Alternativas (4)</label>
                  <FieldArray
                    name="options"
                    render={() => (
                      <>
                        {values.options.map((op, index) => (
                          <div className="mb-2" key={index}>
                            <div className="input-group">
                              <div className="input-group-text">
                                <Field
                                  type="checkbox"
                                  name={`options[${index}].correct`}
                                />
                              </div>
                              <Field
                                name={`options[${index}].text`}
                                className="form-control"
                                placeholder={`Alternativa ${index + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4"
                  disabled={isSubmitting}
                >
                  Salvar Alterações
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </main>
  );
}
