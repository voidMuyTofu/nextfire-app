import { firestore, getUserWithUsername, postToJson } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from "../../styles/Home.module.css";
import PostContent from "../../components/PostContent";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJson(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000, //Esto le dice a nextJs cada cuanto tiempo tiene que regenerar esta pagina en el servidor
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking", //TODO BUSCAR EN LA LECCION 22 QUE HACE ESTO
  };
}

export default function PostPage(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
