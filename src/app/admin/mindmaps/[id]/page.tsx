"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { useMindmapService } from "@/services/mindmap";

export default function EditMindmapPage() {
  const { id } = useParams();
  const router = useRouter();
  const mindmapSrv = useMindmapService();

  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "",
    coverImage: "",
    fileUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState<null | boolean>(null);

  useEffect(() => {
    const carregar = async () => {
      const dados = await mindmapSrv.buscar(id as string);
      if (dados) {
        setInitialValues({
          title: dados.title || "",
          category: dados.category || "",
          coverImage: dados.cover_image || "",
          fileUrl: dados.file_url || "",
        });
      }
      setLoading(false);
    };

    carregar();
  }, [id]);

  const handleSalvar = async (formData: any) => {
    setMensagem(null);

    const payload = {
      title: formData.title,
      category: formData.category,
      cover_image: formData.coverImage,
      file_url: formData.fileUrl,
    };

    const retorno = await mindmapSrv.atualizar(id as string, payload);
    setMensagem(retorno.sucesso);

    if (retorno.sucesso) {
      router.push("/admin/mindmaps");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Editar Mapa Mental" />
      {loading ? (
        <p className="text-center mt-4">Carregando dados...</p>
      ) : (
        <>
          {mensagem === false && (
            <p className="alert alert-danger">
              Erro ao atualizar o mapa mental
            </p>
          )}
          {mensagem === true && (
            <p className="alert alert-success">
              Mapa mental atualizado com sucesso
            </p>
          )}

          <Formik initialValues={initialValues} onSubmit={handleSalvar}>
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="card-body">
                  <div className="row">
                    {/* Título */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Título</label>
                        <Field className="form-control" name="title" />
                      </div>
                    </div>

                    {/* Categoria */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Categoria</label>
                        <Field className="form-control" name="category" />
                      </div>
                    </div>

                    {/* Imagem de capa */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Imagem de Capa</label>
                        {values.coverImage && (
                          <div className="mb-2">
                            <img
                              src={values.coverImage}
                              alt="Capa"
                              style={{ maxWidth: "100%", borderRadius: "8px" }}
                            />
                          </div>
                        )}
                        <FileUpload
                          folder="mindmap-covers"
                          onUpload={(url) => setFieldValue("coverImage", url)}
                        />
                      </div>
                    </div>

                    {/* PDF */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Arquivo PDF</label>
                        {values.fileUrl && (
                          <p>
                            <a
                              href={values.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visualizar PDF Atual
                            </a>
                          </p>
                        )}
                        <FileUpload
                          folder="mindmaps"
                          onUpload={(url) => setFieldValue("fileUrl", url)}
                        />
                      </div>
                    </div>

                    {/* Botão */}
                    <div className="col-md-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isSubmitting}
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </main>
  );
}
