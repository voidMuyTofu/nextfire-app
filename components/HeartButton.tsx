import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore, increment } from "../lib/firebase";

export default function Heart({ postRef }) {
  //* Al tener la referencia del post podemos comprobar
  //* si el usuario ya a dado like al post
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  //? Metodo para dar like a un post
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    //* Se añade un like al contador de likes
    batch.update(postRef, { heartCount: increment(1) });
    //* Se añade la referencia del usuario a los likes del post
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  //? Metodo para quitar like al post
  const removeHeart = async () => {
    const batch = firestore.batch();

    //* Se descuenta el like del post
    batch.update(postRef, { heartCount: increment(-1) });
    //* Se borra la referencia del usuario a los likes del post
    batch.delete(heartRef);

    await batch.commit();
  };

  //*Segun si el usuario ha dado like al post se muestra
  //* el boton de like o de quitar like
  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Ya no me gusta</button>
  ) : (
    <button onClick={addHeart}>💗 Me gusta</button>
  );
}
