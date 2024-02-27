import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/Header.module.css';

import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { useCookies } from 'react-cookie';

import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';


function Header(props) {

    const router = useRouter();
    const [profilePicture, setProfilePicture] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [areDataloaded, setAreDataLoaded] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies();

    useEffect(() => {
        (async () => {
            const config = {
                headers: { 'authorization': `Bearer ${cookies.token}` },
            };

            const response = await fetch(`${process.env.SERVER_ADRESS}/users/currentUser`, config);
            const data = await response.json();
            if (data.result) {
                setProfilePicture(data.user.pictureLink);
                setIsLogged(true);
            }
            setAreDataLoaded(true);
        })()
    }, [props.uploadSent]);


    const popoverContent = (
        <div className={styles.popoverContainer}>
            <ul className={styles.popoverList}>
                <li className={styles.popoverList_item} onClick={() => setIsPopoverOpen(false)}>
                    <Link href="/profile"> Votre profil </Link>
                </li>
                <li className={styles.popoverList_item}>
                    <div onClick={() => { logout(); setIsPopoverOpen(false) }}> Se déconnecter </div>
                </li>
            </ul>
        </div>
    );

    const logout = async () => {
        removeCookies('token');
        router.push('/');
    }

    return (
        <>
            <div className={styles.navContainer}>
                <div className={styles.nav}>

                    <div className={styles.logoContainer}>
                        <Image src="/images/logo2.png" alt="logo" layout='fill' onClick={() => router.push('/')} />
                    </div>


                    <div className={styles.linksContainer}>

                        <Link href="/" className={styles.navLink}> Accueil </Link>

                        <Link href={!isLogged ? '/login' : '/forum'} className={styles.navLink}> Forum </Link>

                        {/* Quand on clique sur "Galerie" et qu'on est pas connecté, on nous envoie vers la page de connexion
                           avec un paramètre "galerie" dans le lien, qui permettra de savoir si on vient par le Link "Galerie" 
                           et donc nous rediriger au bon endroit une fois la connexion faite */}
                        <Link href={!isLogged
                            ? {
                                pathname: '/login',
                                query: { redirect: 'gallery' }
                            }
                            :
                            '/gallery'
                        }

                            className={styles.navLink}>
                            Galerie
                        </Link>

                        <Link href={!isLogged
                            ? {
                                pathname: '/login',
                                query: { redirect: 'actus' }
                            }
                            :
                            '/actus'
                        }
                            className={styles.navLink}> Actus </Link>
                    </div>

                    <div className={styles.logBtnContainer}>

                        {areDataloaded &&
                            !isLogged
                            ?
                            <button className='btn login' onClick={() => router.push('/login')}>
                                Se connecter
                            </button>
                            :
                            <>
                                <Popover
                                    isOpen={isPopoverOpen}
                                    positions={['bottom']} // preferred positions by priority
                                    content={popoverContent}
                                    transform={{ left: -5, top: 3 }}
                                    transformMode='relative'
                                >

                                    <div className={styles.profileImg} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                                        {profilePicture
                                            ?
                                            <Image src={profilePicture} width={80} height={80} alt="profileImg" />
                                            :
                                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                                        }
                                    </div>

                                </Popover>
                            </>
                        }
                    </div>

                </div>
            </div>
        </>

    );
}

export default Header;
