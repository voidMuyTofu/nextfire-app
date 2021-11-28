import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import { firestore } from "../lib/firebase";

export default function UserNameForm() {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, userName } = useContext(UserContext);

  useEffect(() => {
    checkUserName(inputValue);
  }, [inputValue]);

  const onSubmit = async (e) => {
    e.preventDefault();

    //Crear referencia para ambos documentos
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${inputValue}`);

    //Commit ambos documentos junto en el mismo batch de escritura
    //para que si falla uno fallen los dos y no queden datos
    //colgando ya que dependen uno de otro
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: inputValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3 && val.length > 15) {
      setInputValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setInputValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //Lo que hace debounce es para prevenir que la funcion se ejecute
  //desde que el ultimo evento ha llegado (En este caso, que cambie el form)
  //hasta el tiempo que determinamos (500 ms)

  //Tenemos que envolver esta funcion en useCallback porque cada vez que
  //react renderiza la pagina, crea una funcion que no va a ser afectada por
  //por debounce, useCallback permite a react "memorizar" la funcion para
  //para ser utilizada correctamente

  const checkUserName = useCallback(
    debounce(async (userName: string) => {
      if (userName.length >= 3) {
        const ref = firestore.doc(`usernames/${userName}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const UsernameMessage = ({ username, isValid, loading }) => {
    if (loading) {
      return <p>Comprobando nombre de usuario ...</p>;
    } else if (isValid) {
      return <p className="text-success">¡{username} está disponible!</p>;
    } else if (userName && !isValid) {
      return (
        <p className="text-danger">El nombre de usuario está disponible</p>
      );
    } else {
      return <p></p>;
    }
  };
  return (
    !userName && (
      <section>
        <h3>Elige tu nombre de usuario</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="Nombre de usuario"
            onChange={onChange}
          />
          <UsernameMessage
            loading={loading}
            isValid={isValid}
            username={inputValue}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Confirmar
          </button>
          <h3>Debug State</h3>
          <div>
            Nombre de usuario: {inputValue}
            <br />
            Enviando: {loading.toString()}
            <br />
            Nombre de usuario valido: {isValid.toString()}
            <br />
          </div>
        </form>
      </section>
    )
  );
}
