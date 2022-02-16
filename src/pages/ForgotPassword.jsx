import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = e => setEmail(e.target.value)

  const onSubmit = async e => {
    e.preventDefault()

    try {
      const auth = getAuth()

      await sendPasswordResetEmail(auth, email)
      toast.success('Votre lien de récupération ne devrait pas tarder :)')
    } catch (error) {
      toast.error("Il semblerait que nous ayons un problème ..")
    }
  }


  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Mot de passe oublié</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type="email" className="emailInput"
            placeholder="Votre mail" id="email" value={email} onChange={onChange} />
          <Link className="forgotPasswordLink" to={'/sign-in'}>
            Connexion
          </Link>

          <div className="signInBar">
            <div className="signInText">Envoyer le lien de récupération</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#fff" width={'34px'} height={'34px'} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
