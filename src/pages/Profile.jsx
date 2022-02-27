import { useState, useEffect } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import ListingItem from "../components/ListingItem"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )
      const querySnap = await getDocs(q)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate("/")
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Mise à jour du nom affiché dans Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Mise à jour dans le Firestore (BDD)
        const userRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error("Mise à jour impossible des informations personnelles")
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm("Êtes vous sûr de vouloir supprimer cette annonce ?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success("Votre annonce à bien été supprimée")
    }
  }

  // Si l'utilisateur est connecté, j'affiche son nom, sinon je l'informe qu'il est introuvable
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Mon Profil</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Déconnexion
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Informations personnelles</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? "fait" : "modifier"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="Maison" />
          <p>Vendez ou louez votre bien immobilier.</p>
          <img src={arrowRight} alt="Flèche vers la droite" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Vos annonces</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
