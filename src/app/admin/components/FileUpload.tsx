"use client";
import { useState } from "react";
import { supabase } from "@/config/supabase";

interface FileUploadProps {
  onUpload: (url: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
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

    const filePath = `quiz-covers/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("quiz-covers")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("quiz-covers")
      .getPublicUrl(filePath);

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
