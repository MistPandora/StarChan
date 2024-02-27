import styles from '../../styles/Login.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import checkUserForm from '../../modules';


function SignUp(props) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { checkSpecialCharacter, checkUsernameLength, isEmailValid, isPasswordValid, isConfirmPasswordValid, isFormValid } = checkUserForm(username, email, password, confirmPassword);

    const handleClick = () => {
        props.handleRegister(username, email, password)
    }

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>

            <p className={styles.signTitle}>Inscrivez-vous</p>

            <div className={styles.signSection}>

                <input className='input register' type="text" placeholder="Pseudo" id="username" onChange={(e) => setUsername(e.target.value)} value={username} maxLength={15} />

                {/* Affichage du message d'avertissement pour les caractères spéciaux dans le pseudo */}
                {!checkSpecialCharacter && username.length > 0
                    && <p className={styles.warning} style={{ marginBottom: 0 }}>Les caractères spéciaux autorisés sont: - et _</p>
                }

                {/* Affichage du message d'avertissement pour la longueur du pseudo */}
                {!checkUsernameLength && username.length > 0
                    && <p className={styles.warning}>Votre pseudo doit contenir entre 4 et 15 caractères</p>
                }

                {/* Affichage du message d'avertissement pour une adresse e-mail invalide */}
                <input className='input register' type="email" placeholder="E-mail" id="email" onChange={(e) => setEmail(e.target.value)} value={email} maxLength={100} />
                {!isEmailValid && email.length > 0
                    && <p className={styles.warning}>Veuillez entrer un email valide (ex: xyz@example.com)</p>
                }

                {/* Affichage du message d'avertissement pour la longueur du mot de passe */}
                <input className='input register' type="password" placeholder="Mot de passe" id="password" onChange={(e) => setPassword(e.target.value)} value={password} maxLength={50} />
                {!isPasswordValid && password.length > 0
                    && <p className={styles.warning}>Votre mot de passe doit contenir au moins 8 caractères</p>
                }

                {/* Affichage du message d'avertissement pour la confirmation du mot de passe */}
                <input className='input register' type="password" placeholder="Confirmer votre mot de passe" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} maxLength={50} />
                {!isConfirmPasswordValid && confirmPassword.length > 0
                    && <p className={styles.warning}>Les mots de passe doivent être identiques</p>
                }

                {/* Affichage du bouton "S'inscrire" activé ou désactivé en fonction de la validité du formulaire */}
                {isFormValid
                    ?
                    <button className={'btn logout'} id="connection" onClick={() => handleClick()}>S'inscrire</button>
                    :
                    <button className={`btn ${styles.disabled}`}>S'inscrire</button>
                }
            </div>
        </div>
    );




}

export default SignUp