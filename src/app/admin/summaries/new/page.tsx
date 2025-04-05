"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import AdminHeader from "@/app/admin/components/header";
import FileUpload from "@/app/admin/components/FileUpload";
import { supabase } from "@/config/supabase";

export default function NewSummaryPage() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<null | boolean>(null);

  const handleSalvar = async (formData: any) => {
    setMensagem(null);

    const { error } = await supabase.from("summaries").insert({
      title: formData.title,
      category: formData.category,
      cover_image: formData.coverImage,
      file_url: formData.fileUrl,
    });

    if (error) {
      console.error("Erro ao salvar resumo:", error.message);
      setMensagem(false);
    } else {
      setMensagem(true);
      router.push("/admin/summaries");
    }
  };

  return (
    <main>
      <AdminHeader titulo="Novo Resumo" />
      <h6>Formulário</h6>

      {mensagem === false && (
        <p className="alert alert-danger">Erro ao salvar o resumo.</p>
      )}
      {mensagem === true && (
        <p className="alert alert-success">Resumo salvo com sucesso!</p>
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
                {/* título */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Título</label>
                    <Field className="form-control" type="text" name="title" />
                  </div>
                </div>

                {/* categoria */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Categoria</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="category"
                    />
                  </div>
                </div>

                {/* imagem de capa */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Imagem de Capa</label>
                    {values.coverImage && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={values.coverImage}
                          alt="Capa"
                          style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                      </div>
                    )}
                    <FileUpload
                      folder="summary-covers"
                      bucket="summary-covers"
                      onUpload={(url: string) =>
                        setFieldValue("coverImage", url)
                      }
                    />
                  </div>
                </div>

                {/* upload pdf */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Arquivo PDF</label>
                    <FileUpload
                      folder="summaries-pdf"
                      bucket="summaries-pdf"
                      accept="application/pdf"
                      onUpload={(url: string) => setFieldValue("fileUrl", url)}
                    />
                  </div>
                </div>

                {/* Botão */}
                <div className="col-md-12 mt-3">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Salvar Resumo
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
