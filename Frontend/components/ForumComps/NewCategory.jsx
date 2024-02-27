// import styles from '../../styles/Login.module.css';
import styles from '../../styles/NewSubject.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';


function NewCategory(props) {

    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.addCategory(category);
    };


    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.toggleModal()} />
            </div>

            <form onSubmit={handleSubmit} className={styles.categorySection}>
                <p className={styles.categoryTitle} >Créer la nouvelle catégorie</p>
                <input className={`input ${styles.categoryText}`} type="text" placeholder="Catégorie" name="category" onChange={e => setCategory(e.target.value)} value={category} maxLength={45} />
                {category.length
                    ?
                    <button className='btn newSubject' id="category" type="submit">Créer la catégorie</button>
                    :
                    <button className={`btn ${styles.disabled}`}>Créer la catégorie</button>

                }
            </form>

        </div >
    )
};

export default NewCategory;


