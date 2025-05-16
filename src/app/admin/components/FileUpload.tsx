"use client";
import { useState } from "react";
import { supabase } from "@/config/supabase";

interface FileUploadProps {
  onUpload: (url: string) => void;
  folder?: string; // pasta dentro do bucket
  bucket?: string; // nome do bucket
  accept?: string; // tipos aceitos no input file
}

export default function FileUpload({
  onUpload,
  folder = "quiz-covers",
  bucket = "quiz-covers",
  accept = "*/*", // aceita todos os tipos por padrão
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const filePath = `${folder}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (data?.publicUrl) {
      onUpload(data.publicUrl);
      setUploadSuccess(true);
    }

    setUploading(false);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <input
        type="file"
        onChange={handleFileChange}
        className="form-control"
        disabled={uploading}
        accept={accept}
      />

      {file && <small className="text-muted">Selecionado: {file.name}</small>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`btn btn-${uploading ? "secondary" : "primary"} w-100`}
      >
        {uploading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            Enviando...
          </>
        ) : uploadSuccess ? (
          "Arquivo Enviado ✅"
        ) : (
          "Enviar Arquivo"
        )}
      </button>
    </div>
  );
}
