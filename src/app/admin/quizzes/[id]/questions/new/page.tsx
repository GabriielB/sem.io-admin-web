"use client";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, Field, FieldArray } from "formik";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { useQuestionService } from "@/services/question";

export default function NewQuestionPage() {
  const { id: quizId } = useParams();
  const router = useRouter();
  const questionSrv = useQuestionService();

  const initialValues = {
    description: "",
    media: "",
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  };

  return (
    <main>
      <AdminHeader titulo="Nova Pergunta" />

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          const algumaCorreta = values.options.some((opt) => opt.correct);
          if (!algumaCorreta) {
            alert("Marque ao menos uma alternativa correta.");
            setSubmitting(false);
            return;
          }

          const payload = {
            ...values,
            quiz_id: quizId,
          };

          const retorno = await questionSrv.cadastrar(payload);
          setSubmitting(false);
          if (retorno.sucesso) {
            router.push(`/admin/quizzes/${quizId}/questions`);
          } else {
            alert("Erro ao cadastrar pergunta.");
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
                      style={{ maxWidth: "60%", borderRadius: "8px" }}
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
                <small className="text-muted">
                  Marque a alternativa correta com o checkbox
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-4"
                disabled={isSubmitting}
              >
                Cadastrar Pergunta
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
