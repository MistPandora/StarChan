import Link from 'next/link';
import Head from 'next/head';

import styles from '../styles/Gallery.module.css';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useCookies } from 'react-cookie';

import Header from '../components/Header';
import Pictures from '../components/GalleryComps/Pictures';

import { LoadingIcon } from '../modules';
import '@vivid-planet/react-image/dist/react-image.css';

Modal.setAppElement('body');


function FavoritesPage() {

    const [favorites, setFavorites] = useState([]);
    const [isFavoriteAdded, setIsFavoriteAdded] = useState(false);
    const [favoritesLoaded, setFavoritesLoaded] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies();

    useEffect(() => {
        if (!cookies.token) {
            return <ForbiddenAccess />
        }
    }, [cookies]);

    // A modifier
    const email = useSelector(state => state.user.value.email);

    useEffect(() => {
        fetch(`${process.env.SERVER_ADRESS}/gallery/favorites/${email}`)
            .then(response => response.json())
            .then(favoritesData => {
                setFavorites(favoritesData.favorites);
                setFavoritesLoaded(true)
            });
    }, [isFavoriteAdded]);



    const updateFavoritePictures = async (pictureID) => {
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pictureID })
        }

        await fetch(`${process.env.SERVER_ADRESS}/users/updateFavoritePictures`, config);
        setIsFavoriteAdded(!isFavoriteAdded);

    }

    const favoritesElements = favorites.map((dataPhoto, i) => {

        return <Pictures id={dataPhoto._id} username={dataPhoto.user.username} link={dataPhoto.link} title={dataPhoto.title} key={i}{...dataPhoto} alt="photo" starColor={{ color: "yellow" }} updateFavoritePictures={updateFavoritePictures} />;
    })


    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            <>
                <Head>
                    <title>StarChan - Mes favoris</title>
                </Head>
                <Header />

                <div className={styles.main}>
                    <div className={styles.container}>
                        <h1 className='title'>Mes favoris</h1>

                        {favoritesLoaded
                            ?
                            (
                                favoritesElements.length
                                    ?
                                    <>
                                        <div className={styles.containerGalleryPhoto}>{favoritesElements.reverse()}</div>
                                        <div className={styles.favoriteBtnContainer}>
                                            <Link className='btn newSubject' href="/gallery"> Retour à la galerie </Link>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={styles.containerGalleryPhoto}>
                                            <p style={{ width: '100%', textAlign: 'center' }}>Vous n'avez pas encore de photos en favoris.</p>
                                        </div>
                                        <div className={styles.favoriteBtnContainer}>
                                            <Link className='btn newSubject' href="/gallery"> Retour à la galerie </Link>
                                        </div>
                                    </>
                            )
                            :
                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                        }

                    </div>
                </div>
            </>
    )
}

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '590px',
        marginRight: '-50%',
        transform: 'translate(-50%, -60%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

    },
};

export default FavoritesPage;
