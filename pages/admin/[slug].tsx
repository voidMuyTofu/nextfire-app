import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";

export default function AdminEditPost({ props }) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

const PostManager = () => {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug.toString());

  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container2}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside style={{ padding: "30px" }}>
            <h3>Herramientas</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Editar" : "Vista previa"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Vista en vivo</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

const PostForm = ({ defaultValues, postRef, preview }) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post actualizado correctamente");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          className={styles.textarea}
          {...register("content")}
        ></textarea>
        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>Publicado</label>
        </fieldset>

        <button type="submit" className="btn-green">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};
