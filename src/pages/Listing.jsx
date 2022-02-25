import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    }, [navigate, params.listingId])

    // if loading is true, we return a spinner
    if (loading) {
        return <Spinner />
    }

    return <main>
        {/* Slider */}

        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
                setShareLinkCopied(false)
            }, 2000)
        }} >
            <img src={shareIcon} alt="Icône partage" />
        </div>

        {/*If the link is actually copied, we'll show a paragraph telling the user that the link is copied*/}
        {shareLinkCopied && <p className="linkCopied" >Lien Copié !</p>}

        <div className="listingDetails">
            <p className="listingName">
                {listing.name} -
                {listing.offer
                    ? listing.discountedPrice
                    : listing.regularPrice} €
            </p>
            <p className="listingLocation"> {listing.location} </p>
            <p className="listingType">En {listing.type === 'rent' ? 'Location' : 'Vente'} </p>
            {listing.offer && (
                <p className="discountPrice">
                    Remise de &nbsp;
                    {listing.regularPrice - listing.discountedPrice} € !
                </p>
            )}
            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Chambres` : '1 Chambre'}
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Salles de bain` : '1 Salle de bain'}
                </li>
                <li>{listing.parking && 'Place de parking'}</li>
                <li>{listing.furnished && 'Meublé'}</li>
            </ul>
            <p className="listingLocationTitle">Emplacement</p>

            <div className="leafletContainer">
                <MapContainer style={{ height: '100%', width: '100%' }} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={true} >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />
                    <Marker position={[listing.geolocation.lat, listing.geolocation.lng]} >
                        <Popup>{listing.location}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/*Add a link to contact the landlord if it's not that user's listing*/}
            {auth.currentUser?.uid !== listing.userRef && (
                <Link
                    to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                    className='primaryButton'
                >
                    Contacter le propriétaire
                </Link>
            )}
        </div>
    </main>
}

export default Listing