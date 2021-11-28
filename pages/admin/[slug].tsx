import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore } from "../../lib/firebase";
import styles from "../../styles/Home.module.css";

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
    <main className={styles.container}>
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
          <aside></aside>
        </>
      )}
    </main>
  );
};

const PostForm = ({ defaultValues, postRef, preview }) => {
  return <></>;
};
