import styles from '../styles/Profile.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import Files from 'react-files';
import Modal from 'react-modal';
import { useCookies } from 'react-cookie';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import ForbiddenAccess from '../components/ForbiddenAccess';
import Header from '../components/Header';

import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';
import checkUserForm from '../modules/checkUserForm';

Modal.setAppElement('body');


function ProfilePage() {

    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [confirmUpdatedPassword, setConfirmUpdatedPassword] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [uploadSent, setUploadSent] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies();

    useEffect(() => {
        (async () => {
            const config = {
                headers: { 'authorization': `Bearer ${cookies.token}` },
            };

            const response = await fetch(`${process.env.SERVER_ADRESS}/users/currentUser?email=true&createdSubjects=true`, config);
            const data = await response.json();
            if (data.result) {
                console.log(data);
                setUpdatedUsername(data.user.username);
                setUpdatedEmail(data.user.email);
                setProfilePicture(data.user.pictureLink);
            }
        })()
    }, [uploadSent]);

    if (!cookies.token) {
        return <ForbiddenAccess />
    }


    const { checkSpecialCharacter, checkUsernameLength, isEmailValid, isPasswordValid, isConfirmPasswordValid, isFormValid } = checkUserForm(updatedUsername, updatedEmail, updatedPassword, confirmUpdatedPassword);


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const getImgFileUrl = async () => {
        const formData = new FormData();
        formData.append('image', imgFile);

        const config = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${cookies.token}`
            },
            body: formData,
        }

        const response = await fetch(`${process.env.SERVER_ADRESS}/pictures/?profile=true`, config)
        const data = await response.json();
        return data.url
    }

    const updateProfile = async () => {

        const updatedPictureLink = imgFile ? await getImgFileUrl() : profilePicture;

        const config = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${cookies.token}`
            },
            body: JSON.stringify({ updatedUsername, updatedEmail, updatedPassword, updatedPictureLink }),
        }

        await fetch(`${process.env.SERVER_ADRESS}/users/profile`, config)

        setUpdatedPassword('');
        setConfirmUpdatedPassword('');
    };

    const loadingUpdate = async () => {
        openModal();
        await updateProfile(updatedUsername, updatedEmail, updatedPassword)
        closeModal();
        setUploadSent(!uploadSent);
    }

    const handleFileChange = (files) => {
        setImgFile(files[0] ? files[0] : '');
    }

    const handleFileError = (error, file) => {
        alert("Votre image est trop volumineuse (max 4.5Mo)");
        console.log('Error code: ' + error.code + ': ' + error.message)
    }

    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            <>
                <Header uploadSent={uploadSent} />
                <div className={styles.container}>
                    <div className={styles.imgContainer}>
                        <Files
                            className={styles.profileImg}
                            onChange={handleFileChange}
                            onError={handleFileError}
                            accepts={['image/png', 'image/jpg', 'image/jpeg']}
                            maxFileSize={4500000}
                            minFileSize={0}
                            clickable>
                            {profilePicture ?
                                <>
                                    <img data-tooltip-id="imgTooltip" src={imgFile ? imgFile.preview.url : profilePicture} alt="profileImg" />
                                    <FontAwesomeIcon icon={faPen} className={styles.penIcon} />
                                </>
                                :
                                <LoadingIcon src="" className={styles.imgLoadingIcon} width={0} height={0} />

                            }
                        </Files>
                        <Tooltip id="imgTooltip" style={{ maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} content="Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 4.5Mo)" />
                    </div>
                    <div className={styles.infoContainer}>

                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Votre pseudo</p>
                            <input className={`input ${styles.profileInput}`} type="text" onChange={e => setUpdatedUsername(e.target.value)} value={updatedUsername} />

                            {/* Affichage du message d'avertissement pour les caractères spéciaux dans le pseudo */}

                            {!checkSpecialCharacter && updatedUsername
                                && <p className={styles.warning} style={{ marginBottom: 0 }}>Les caractères spéciaux autorisés sont: - et _</p>
                            }

                            {/* Affichage du message d'avertissement pour la longueur du pseudo */}
                            {!checkUsernameLength && updatedUsername
                                && <p className={styles.warning}>Votre pseudo doit contenir entre 4 et 15 caractères</p>
                            }
                        </div>

                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Votre email</p>
                            <input className={`input ${styles.profileInput}`} type="email" onChange={e => setUpdatedEmail(e.target.value)} value={updatedEmail} />

                            {/* Affichage du message d'avertissement pour une adresse e-mail invalide */}
                            {!isEmailValid && updatedEmail
                                && <p className={styles.warning}>Veuillez entrer un email valide</p>
                            }
                        </div>

                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Modifier votre mot de passe</p>
                            <input className={`input ${styles.profileInput}`} type="password" onChange={e => setUpdatedPassword(e.target.value)} value={updatedPassword} />

                            {/* Affichage du message d'avertissement pour la longueur du mot de passe */}
                            {!isPasswordValid && updatedPassword
                                && <p className={styles.warning}>Votre mot de passe doit contenir au moins 8 caractères</p>
                            }
                        </div>

                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Confirmer votre mot de passe</p>
                            <input className={`input ${styles.profileInput}`} type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmUpdatedPassword} />

                            {/* Affichage du message d'avertissement pour la confirmation du mot de passe */}
                            {!isConfirmPasswordValid && confirmUpdatedPassword
                                && <p className={styles.warning}>Les mots de passe doivent être identiques</p>
                            }
                        </div>

                        {/* Affichage du bouton "S'inscrire" activé ou désactivé en fonction de la validité du formulaire */}
                        {isFormValid
                            ?
                            <button className={`btn newSubject ${styles.updateBtn}`} id="update" onClick={() => loadingUpdate()}>Enregistrer</button>
                            :
                            <button className={`btn ${styles.disabled}`}>Enregistrer</button>
                        }

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            contentLabel="Example Modal"
                            className={styles.Modal}
                            overlayClassName={styles.Overlay}
                            style={customStyles}
                            shouldCloseOnOverlayClick={false}
                        >
                            {
                                <div className={styles.loadingContainer}>
                                    <p className={styles.loadingTitle}>Modification en cours, veuillez patienter...</p>
                                    <LoadingIcon src="" className={styles.loadingIcon} />
                                </div>
                            }
                        </Modal>
                    </div>
                </div>
            </>)
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
        width: '500px',
        marginRight: '-50%',
        transform: 'translate(-50%, -60%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

    },
};

export default ProfilePage;