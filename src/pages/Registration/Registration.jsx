import { useState } from 'react';
import './Registration.scss';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {set,ref} from 'firebase/database'
import { auth,db } from '../../FirebaseConfig';
export default function Registration() {

    const navigate = useNavigate();

    // Function navigation example
    const handleLoginClick = () => {
        navigate('/login');
    }

    // Form fields...
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    // Function to handle form submission and register a new user
    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Next actions here..
               const userRef = ref(db,'users/'+email)
                 set(userRef,{'points':500})
               
                console.log(user);
                //Example: go to profile page after registration - `navigate("/profile")`
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }

    // Registration Page JSX here...
    return (
        <main className='registration'>

        </main>
    );
}
