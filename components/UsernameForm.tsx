import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce'
import { firestore } from '../lib/firebase';

export default function UserNameForm() {
    const [inputValue, setInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user, userName} = useContext(UserContext);

    useEffect(() => {
        checkUserName(inputValue);
    }, [inputValue]);

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(val < 3){
            setInputValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if(re.test(val)){
            setInputValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    const checkUserName = useCallback(
        debounce(async (userName : string) =>{
            if(userName.length >= 3){
                const ref = firestore.doc(`usernames/${userName}`);
                const {exists} = await ref.get();
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !userName && (
            <section>
                <h3>Elige tu nombre de usuario</h3>
                <form>
                    <input name="username" placeholder="Nombre de usuario" value={inputValue} onChange={onChange}/>
                    <button type="submit" className="btn-green" disabled={!isValid}>Confirmar</button>
                    <h3>Debug State</h3>
                    <div>
                        Nombre de usuario: {inputValue}
                        <br/>
                        Enviando: {loading.toString()}
                        <br/>
                        Nombre de usuario valido: {isValid.toString()}
                        <br/>
                    </div>
                </form>
            </section>
        )
    );
}