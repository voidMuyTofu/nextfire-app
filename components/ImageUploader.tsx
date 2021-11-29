import { useState } from "react";
import { auth, STATE_CHANGED, storage } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const uploadFile = async (e) => {
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    //* Crear referencia a la carpeta del usuario en storage
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);
    //* Comienza la subida de la imagen
    const task = ref.put(file);
    //* Monitorizar las actualizaciones de la tarea de subida
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      //*Obtener la url de descarga despues de que se acabe la tarea
      //! Esto no es una promesa nativa (No es puede hacer con async)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadUrl(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Subir imagen
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            ></input>
          </label>
        </>
      )}

      {downloadUrl && (
        <code className="upload-snippet">{`![alt](${downloadUrl})`}</code>
      )}
    </div>
  );
}
