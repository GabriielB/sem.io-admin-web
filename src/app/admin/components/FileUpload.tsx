import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

interface FileUploadProps {
  onUpload: (url: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        // referencia unica na store com timestamp
        const storageRef = ref(
          storage,
          `quiz-covers/${file.name}-${Date.now()}`
        );
        // upload do arquivo
        const snapshot = await uploadBytes(storageRef, file);
        // url de download
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);
        console.log(snapshot);
        onUpload(downloadURL);
      } catch (error) {
        console.error("Erro no upload:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Enviando..." : "Upload"}
      </button>
    </div>
  );
}
