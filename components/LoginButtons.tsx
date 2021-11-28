import { auth, googleAuthProvider } from "../lib/firebase";

export function SignInButton() {
  const signInWithGoogle = async () => {
    auth.setPersistence("local").then(async () => {
      try {
        await auth.signInWithPopup(googleAuthProvider);
      } catch (err) {
        console.error(err);
      }
    });
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.jpeg"} /> Iniciar sesión con Google
    </button>
  );
}

export function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Cerrar sesión</button>;
}
