import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/DetailledPicture.module.css';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';


function detailledPicture(props) {

    const router = useRouter();
    const pictureId = router.query.q;
    const [pictureData, setPictureData] = useState({});
    const [cookies, setCookies, removeCookies] = useCookies();

    useEffect(() => {
        if (!cookies.token) {
            return <ForbiddenAccess />
        }
    }, [cookies]);

    useEffect(() => {
        if (router.isReady) {
            fetch(`${process.env.SERVER_ADRESS}/gallery/${pictureId}`)
                .then(response => response.json())
                .then(data => {
                    setPictureData(data.picture)
                })
        }
    }, [router.isReady])


    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            pictureData.title &&
            <div className={styles.containerWrapper}>
                <p className={styles.titlePicture} >{pictureData.title}</p>
                <div className={styles.container}>


                    <div className={styles.pictureAndProfileContainer}>

                        <div className={styles.pictureDetailledContainer}>
                            {pictureData.link && <Image src={pictureData.link} alt={props.title} width="500" height="500" />}
                            <p className={styles.place}>Lieu : {pictureData.place}</p>
                        </div>


                        <div className={styles.profilImage}>
                            <Image src={pictureData.user.link} width={100} height={100} alt="profileImg" className={styles.imgProfile} />

                            <p className={styles.text}>{pictureData.user.username}</p>
                            <p className={styles.text}>{TimeAgo(pictureData.date)}</p>

                        </div>


                    </div>
                    <div className={styles.textContainer}>

                        <p className={styles.text1}>{pictureData.description} </p>

                    </div>

                </div>

                <div className={styles.galleryContainer}>
                    <Link className='btn newSubject' href="/gallery"> Retour à la galerie </Link>
                </div>
            </div>


    )

}









export default detailledPicture;