import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { UserContext } from '../lib/context';
import { auth, firestore } from '../lib/firebase';


function MyApp({ Component, pageProps }) {

  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  
  useEffect(() => {
    let unsuscribe;

    if (user){
      const ref = firestore.collection('users').doc(user.uid);
      unsuscribe = ref.onSnapshot((doc) => {
        setUserName(doc.data()?.username);
      });
    }else{
      setUserName(null);
    }

    return unsuscribe;
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userName}}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
