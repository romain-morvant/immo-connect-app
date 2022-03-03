import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Vérification de l'utilisateur
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            // Si l'utilisateur n'existe pas, on le crée
            // La méthode doc prend 3 paramètres : La BDD, la collection et l'id de l'utilisateur
            if (!docSnap.exists()) {
                // La méthode setDoc prend elle, deux paramètres: le document actuel, et les données que l'on souhaite ajouter à la BDD
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }

            navigate('/')

        } catch (error) {
            toast.error('Connexion avec Google impossible')
        }
    }


    return <div className='socialLogin'>
        <p>S{location.pathname === '/sign-up' ? "'inscrire" : "e connecter"} avec </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className='socialIconImg' src={googleIcon} alt="Icône Google" />
        </button>
    </div>

}

export default OAuth