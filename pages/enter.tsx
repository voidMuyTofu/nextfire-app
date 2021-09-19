import { useContext } from 'react';
import { UserContext } from '../lib/context';
import {SignInButton, SignOutButton} from '../components/LoginButtons';
import UserNameForm from '../components/UsernameForm'

export default function SignUp({ }) {

    const {user, userName} = useContext(UserContext);

    /**
     * ! 1. Si el usuario esta logado pero no tiene nombre de usuario mostramos <UserNameForm/>
     * ? 2. Si el usuario esta logado y tiene nombre mostramos <SignOutButton/>
     * * 3. Si el usuario no esta logado mostramos <SignInButton/>
     */2

    return (
        <main>
            
            {user ?
                !userName ? <UserNameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    )
}