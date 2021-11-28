import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

const PostList = () => {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Administra tu posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { userName } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    //* Como no queremos que se nos genere un post
    //* con un id autogenerado, hacemos referencia
    //* a un doc que todavia no exite con el slug
    //* para que asi se cree con el slug como id
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    //* Construimos el post para crearlo en la base de datos
    //* Dandoles un valor predeterminado a cada campo para
    //* que luego no haya errores al acceder a un campo que no exista
    const data = {
      title,
      slug,
      uid,
      username: userName,
      content: "Hola mundo",
      published: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);
    toast.success("Se ha creado el post");
    //* Mandamos al usuario a la pagina del post
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <p>
        <strong>Slug: </strong>
        {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Crear Nuevo Post
      </button>
    </form>
  );
};
