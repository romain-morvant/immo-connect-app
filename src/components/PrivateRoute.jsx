import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner'

const PrivateRoute = () => {
    // On veut d'abord vérifier si l'utilisateur est connecté à Firebase
    const { loggedIn, checkingStatus } = useAuthStatus();

    // On informe l'utilisateur que l'app vérifie ses paramètres
    if (checkingStatus) {
        return <Spinner />
    }

    // S'il n'est pas connecté, on le redirige vers la page d'inscription
    return loggedIn ? <Outlet /> : <Navigate to={'/sign-in'} />;
};

export default PrivateRoute;