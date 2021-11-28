import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";

//? Esto es un componente que solo renderiza
//? a sus children si el usuario no esta autentificado
export default function AuthCheck(props) {
  const { userName } = useContext(UserContext);

  return userName
    ? props.children
    : props.fallback || (
        <>
          <p>Tienes que iniciar sesion para acceder a esta pagina</p>
          <Link href="/enter">
            <button className="btn-blue">Iniciar sesion</button>
          </Link>
        </>
      );
}
