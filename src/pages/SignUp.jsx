import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();

      // Ici on enregistre l'utilisateur grâce à la fonction crée à cet effet
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name
      });

      // On récupère ce que contient le formData, qu'on stocke dans une copie afin d'en retirer le mot de passe avant son stockage en BDD (Firestore)
      const formDataCopy = { ...formData };
      // Nous ne voulons pas enregistrer le mot de passe utilisateur.
      // La méthode delete le retire donc de l'objet formData
      delete formDataCopy.password;
      // Lorsque l'utilisateur sera envoyé, la date sera ajoutée automatiquement
      formDataCopy.timestamp = serverTimestamp();

      // Ici j'envoie mon utilisateur dans la collection 'users' de ma BDD
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error) {
      toast.error("Il semblerait qu'il y ait un problème..");
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Heureux de vous compter parmis nous !</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='name'
            className='nameInput'
            placeholder='Votre nom'
            id='name'
            value={name}
            onChange={onChange}
          />
          <input
            type='email'
            className='emailInput'
            placeholder='Votre mail'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Votre mot de passe'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='Afficher le mot de passe'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Mot de passe oublié ?
          </Link>

          <div className='signUpBar'>
            <p className='signUpText'>Inscription</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <Link to='/sign-in' className='registerLink'>
          Se connecter
        </Link>
      </div>
    </>
  );
}

export default SignUp;