import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, userName } = useContext(UserContext);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">TOFU</button>
          </Link>
        </li>
        {!!userName ? (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Escribe un post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${userName}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
