"use client";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { useMindmapService } from "@/services/mindmap";

export default function NewMindmapPage() {
  const router = useRouter();
  const mindmapSrv = useMindmapService();
  const [mensagem, setMensagem] = useState<null | boolean>(null);

  const handleSalvar = async (formData: any) => {
    setMensagem(null);

    const mapa = {
      title: formData.title,
      category: formData.category,
      cover_image: formData.coverImage,
      file_url: formData.fileUrl,
    };

    const retorno = await mindmapSrv.cadastrar(mapa);
    setMensagem(retorno.sucesso);

    if (retorno.sucesso) {
      router.push("/admin/mindmaps");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Cadastrar Mapa Mental" />
      <h6>Formulário</h6>

      {mensagem === false && (
        <p className="alert alert-danger">Erro ao cadastrar o mapa mental</p>
      )}
      {mensagem === true && (
        <p className="alert alert-success">
          Mapa mental cadastrado com sucesso
        </p>
      )}

      <Formik
        initialValues={{
          title: "",
          category: "",
          coverImage: "",
          fileUrl: "",
        }}
        onSubmit={handleSalvar}
      >
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

                {/* Imagem de Capa */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Imagem de Capa</label>
                    {values.coverImage && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={values.coverImage}
                          alt="Capa"
                          style={{ maxWidth: "100%", height: "auto" }}
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
                    Cadastrar
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
