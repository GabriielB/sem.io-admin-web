"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { useSummaryService } from "@/services/summary";

export default function EditSummaryPage() {
  const { id } = useParams();
  const router = useRouter();
  const summarySrv = useSummaryService();

  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "",
    cover_image: "",
    file_url: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const dados = await summarySrv.buscar(id as string);
      if (dados) {
        setInitialValues({
          title: dados.title || "",
          category: dados.category || "",
          cover_image: dados.cover_image || "",
          file_url: dados.file_url || "",
        });
      }
      setLoading(false);
    };

    carregar();
  }, [id]);

  return (
    <main>
      <AdminHeader titulo="Editar Resumo" />

      {loading ? (
        <p className="text-center mt-4">Carregando resumo...</p>
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            const retorno = await summarySrv.atualizar(id as string, values);
            setSubmitting(false);

            if (retorno.sucesso) {
              router.push("/admin/summaries");
            } else {
              alert("Erro ao atualizar resumo.");
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="card-body">
                <div className="form-group">
                  <label>Título</label>
                  <Field name="title" className="form-control" />
                </div>

                <div className="form-group mt-3">
                  <label>Categoria</label>
                  <Field name="category" className="form-control" />
                </div>

                <div className="form-group mt-3">
                  <label>Imagem de Capa</label>
                  {values.cover_image && (
                    <div style={{ marginBottom: "10px" }}>
                      <img
                        src={values.cover_image}
                        alt="Capa atual"
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                  <FileUpload
                    bucket="summary-covers"
                    folder="summary-covers"
                    onUpload={(url: string) =>
                      setFieldValue("cover_image", url)
                    }
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Arquivo PDF</label>
                  {values.file_url && (
                    <div style={{ marginBottom: "10px" }}>
                      <a
                        href={values.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver arquivo atual
                      </a>
                    </div>
                  )}
                  <FileUpload
                    bucket="summaries-pdf"
                    folder="summaries-pdf"
                    onUpload={(url: string) => setFieldValue("file_url", url)}
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
