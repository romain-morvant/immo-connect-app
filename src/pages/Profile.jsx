import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };


  // Si l'utilisateur est connecté, j'affiche son nom, sinon j'informe le visiteur qu'il est introuvable
  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader"> Mon Profil</p>
      <button type='button' className="logOut" onClick={onLogout}>
        Logout
      </button>
    </header>
  </div>;
}

export default Profile;
