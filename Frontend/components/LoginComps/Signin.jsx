import styles from '../../styles/Login.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useRef, useState } from 'react';

import { useForm } from '../../hooks';


function SignIn(props) {

    const [isConnectionSucceeded, setIsConnectionSucceeded] = useState(true);
    const inputsRef = useRef([]);

    const fields = [
        {
            name: "email",
            type: "email",
            placeholder: "E-mail",
            className: "input register",
            maxLength: 100
        },
        {
            name: "password",
            type: "password",
            placeholder: "Mot de passe",
            maxLength: 50
        }
    ];

    const checkInputsMaxLength = async (elements) => {
        return (
            elements.every(el => {
                const matchingField = fields.find(field => field.name === el.name);
                return matchingField && matchingField.maxLength === el.maxLength;
            })
        )
    }

    const onSubmit = async (e) => {

        const canSubmit = await checkInputsMaxLength(inputsRef.current);

        if (!canSubmit) {
            alert('Veuillez ne pas modifier les éléments du site :)');
            props.closeModal();
            return;
        }

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        setIsConnectionSucceeded(await props.handleConnection(email, password));
    };

    const { isSubmitted, handleInputChange, handleSubmit } = useForm({ onSubmit });

    const handleEnterKeyDown = (e) => {
        e.key == 'Enter' && checkEntries(e.target);
    };

    const inputElements = fields.map((field, i) => (
        <input key={i} {...field} ref={input => { inputsRef.current[i] = input }} className="input register" onChange={handleInputChange} onKeyDown={handleEnterKeyDown} />
    ));

    if (!isConnectionSucceeded && !isSubmitted) {
        setIsConnectionSucceeded(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>
            <p className={styles.signTitle}>Connectez-vous</p>

            {!isConnectionSucceeded && isSubmitted
                && <p className={`${styles.warning} ${styles.invalidUser}`}>Le mot de passe est incorrect ou le compte n'existe pas.</p>}

            <form onSubmit={handleSubmit} className={styles.signSection}>
                {inputElements}
                <button id="a" type="submit" className='btn login'>Se connecter</button>
            </form>

        </div >
    )
};

export default SignIn;


