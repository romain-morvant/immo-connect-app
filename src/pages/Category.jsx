import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"

const Category = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Récupération de la référence
                const listingsRef = collection(db, 'listings')

                // Création de la requête
                const q = query(
                    listingsRef,
                    where('type',
                        '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                // Exécution de la requête
                const querySnap = await getDocs(q)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)

            } catch (error) {
                toast.error('Impossible de récupérer les biens ...')

            }
        }

        fetchListings()
    }, [params.categoryName])


    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === 'rent'
                        ? 'Biens en location'
                        : 'Biens en vente'}
                </p>
            </header>

            {loading ? <Spinner /> : listings && listings.length > 0 ? (<>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => (
                            <h3 key={listing.id}>{listing.data.name}</h3>
                        ))}
                    </ul>
                </main>
            </>) : (
                <p>Désolé, nous n'avons pas de bien en {params.categoryName === 'rent' ? 'location' : 'vente'} à vous proposer.</p>
            )}


        </div>
    )
}

export default Category