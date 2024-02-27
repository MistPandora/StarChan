import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Gallery.module.css';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useCookies } from 'react-cookie';

import Header from '../components/Header';
import Pictures from '../components/GalleryComps/Pictures';
import NewPicture from '../components/GalleryComps/NewPicture';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';

Modal.setAppElement('body');


function GalleryPage() {

    const [galleryPhoto, setGalleryPhoto] = useState([]);
    const [isPhotoAdded, setIsPhotoAdded] = useState(false);
    const [isFavoriteAdded, setIsFavoriteAdded] = useState(false);
    const [galleryLoaded, setGalleryLoaded] = useState(false);
    const [connectedUser, setConnectedUser] = useState(null);
    const [cookies, setCookies, removeCookies] = useCookies();

    if (!cookies.token) {
        return <ForbiddenAccess />
    }

    useEffect(() => {
        (async () => {
            const config = {
                headers: { 'authorization': `Bearer ${cookies.token}` },
            };

            const response = await fetch(`${process.env.SERVER_ADRESS}/users/currentUser?favoritePictures=true`, config);
            const data = await response.json();
            setConnectedUser(data.user);
        })()

    }, [cookies, isFavoriteAdded]);

    // à chaque ajout d'une photo la galerie se met à jour

    useEffect(() => {
        fetch(`${process.env.SERVER_ADRESS}/gallery`)
            .then(response => response.json())
            .then(dataPhoto => {
                setGalleryPhoto(dataPhoto.pictures);
                setGalleryLoaded(true)
            });
    }, [isPhotoAdded]);


    const photoAdded = () => {
        setIsPhotoAdded(!isPhotoAdded);
        closeModal();
    }

    // paramétrage du modal

    const [modalIsOpen, setIsOpen] = useState(false);
    const [newPictureClicked, setNewPictureClicked] = useState(false);


    // modal pour poster la nouvelle photo

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    // Met à jour les photos en favoris de l'utilisateur

    const updateFavoritePictures = async (pictureID) => {
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pictureID })
        }

        await fetch(`${process.env.SERVER_ADRESS}/users/updateFavoritePictures`, config);
        setIsFavoriteAdded(!isFavoriteAdded);

    }

    // Récupérer les informations des images s'il y en a pour mettre à jour la galerie

    const gallery = galleryPhoto.map((dataPhoto, i) => {
        if (connectedUser.username) {
            const isPictureIncluded = connectedUser.favoritePictures.some(picture => picture._id == dataPhoto._id);
            const starColor = isPictureIncluded ? { color: 'yellow' } : {};
            return <Pictures id={dataPhoto._id} username={dataPhoto.user.username} link={dataPhoto.pictureLink} title={dataPhoto.title} key={i}{...dataPhoto} updateFavoritePictures={updateFavoritePictures} starColor={starColor} />;
        }
    })


    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            <>
                <Head>
                    <title>StarChan - Galerie photo</title>
                </Head>
                <Header />

                <div className={styles.main}>
                    <div className={styles.container}>

                        <h1 className='title'>Galerie photos</h1>

                        <div className={styles.groupBtnContainer}>

                            <div className={styles.btnContainer}>
                                <Link className='btn newSubject' href="/favorites"> Mes favoris </Link>
                                <button className='btn newSubject'
                                    onClick={() => { setNewPictureClicked(true); openModal() }}
                                >
                                    Poster une photo
                                </button>
                            </div>

                        </div>

                        {galleryLoaded
                            ?
                            (
                                gallery.length
                                    ?
                                    <div className={styles.containerGalleryPhoto}>{gallery.reverse()}</div>
                                    :
                                    <div className={styles.containerGalleryPhoto}>
                                        <p style={{ width: '100%', textAlign: 'center' }}>Il n'y a pas encore de photos.</p>
                                    </div>
                            )
                            :
                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                        }



                    </div>

                    {/* mise en place du modal */}
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="NewPicture Modal"
                        className={styles.Modal}
                        overlayClassName={styles.Overlay}
                        style={customStyles}
                    >
                        {<NewPicture photoAdded={photoAdded} closeModal={closeModal} />}

                    </Modal>

                </div>
            </>
    )
}

// css de la modale

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
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

    },
};

export default GalleryPage;
