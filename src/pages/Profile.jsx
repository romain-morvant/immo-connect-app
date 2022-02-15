import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function Profile() {
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);


  // Si l'utilisateur est connecté, j'affiche son nom, sinon j'informe le visiteur qu'il est introuvable
  return user ? <h1>{user.displayName}</h1> : 'Utilisateur Introuvable ..';
}

export default Profile;
