import Head from 'next/head';

import styles from '../styles/Forum.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { Category, NewCategory, NewSubjects } from '../components/ForumComps';

import Modal from 'react-modal';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { useFetch } from '../hooks';

import Header from '../components/Header';
import ForbiddenAccess from '../components/ForbiddenAccess';

import { forbiddenWords, toggleModal, LoadingIcon } from '../modules';
import '@vivid-planet/react-image/dist/react-image.css';

Modal.setAppElement('body');

function ForumPage() {

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isSubjectAdded, setIsSubjectAdded] = useState(false);
    const [isCategoryAdded, setIsCategoryAdded] = useState(false);

    const [searchKeywords, setSearchKeywords] = useState('');
    const [searching, setSearching] = useState(false);
    const [matchingSubjects, setMatchingSubjects] = useState([]);
    const [isResearchReseted, setIsResearchReseted] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState('');

    const [cookies, setCookies, removeCookies] = useCookies();

    const authConfig = {
        headers: { 'authorization': `Bearer ${cookies.token}` },
    };

    const [userData, userError, isUserLoading] = useFetch(`${process.env.SERVER_ADRESS}/users/currentUser`, authConfig);
    const [categoriesData, categoriesError, areCategoriesLoading] = useFetch(`${process.env.SERVER_ADRESS}/categories`, {}, [isSubjectAdded, isCategoryAdded, isResearchReseted]);

    const userRole = userData && userData.user.role;
    const categories = categoriesData ? categoriesData.categories : [];

    const openDeleteModal = (id) => {
        toggleModal(setIsDeleteModalOpen, true);
        setCategoryToDelete(id);
    };

    const closeDeleteModal = () => {
        toggleModal(setIsDeleteModalOpen, false);
        setCategoryToDelete('');
    };

    const addCategory = async (category) => {

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authConfig.headers
            },
            body: JSON.stringify({ title: forbiddenWords(category) }),
        };

        await fetch(`${process.env.SERVER_ADRESS}/categories/new`, config);
        setIsCategoryAdded(!isCategoryAdded);
        setIsCategoryModalOpen(false);
    };

    const uploadImage = async (imgFile) => {

        const formData = new FormData();
        formData.append('image', imgFile);

        const config = {
            method: 'POST',
            headers: {
                ...authConfig.headers
            },
            body: formData
        };

        const response = await fetch(`${process.env.SERVER_ADRESS}/pictures?forum=true`, config)
        const data = await response.json();

        return data.url;
    }

    const addSubject = async (dataToSend, imgFile) => {

        const pictureLink = imgFile && await uploadImage(imgFile);

        if (pictureLink) dataToSend.pictureLink = pictureLink;

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authConfig.headers
            },
            body: JSON.stringify(dataToSend),
        };

        await fetch(`${process.env.SERVER_ADRESS}/subjects/new`, config);
        setIsSubjectAdded(!isSubjectAdded);
        setIsSubjectModalOpen(false);
    };

    const deleteCategory = async () => {
        const deleteConfig = {
            method: 'DELETE',
            headers: { ...authConfig.headers }
        };

        await fetch(`${process.env.SERVER_ADRESS}/categories/${categoryToDelete}`, deleteConfig);

        setIsCategoryAdded(!isCategoryAdded);
        closeDeleteModal();
    };


    const searchSubjects = async () => {
        let keywords = searchKeywords.trim();

        if (!keywords) {
            setIsResearchReseted(!isResearchReseted);
            setSearching(false);
            return
        };

        keywords = keywords.replace(' ', '+');

        const subjResponse = await fetch(`${process.env.SERVER_ADRESS}/subjects/search?keywords=${keywords}`, authConfig);
        const subjData = await subjResponse.json();

        if (subjData.result) {
            setMatchingSubjects(subjData.subjects);
            setSearching(true);
        } else {
            alert("Aucun sujet trouvé");
            setSearching(false);
        };
    };

    const categoriesElements = categories && categories.map((e, i) => {
        return <Category
            key={i}
            title={e.title}
            id={e._id}
            isSubjectAdded={isSubjectAdded}
            matchingSubjects={matchingSubjects}
            searching={searching}
            openDeleteModal={openDeleteModal}
            userRole={userRole}
        />
    });

    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            <>
                <Head>
                    <title>StarChan - Forum</title>
                </Head>
                <Header />

                <div className={styles.main}>
                    <div className={styles.container}>

                        <h1 className='title'>Forum</h1>

                        <div className={styles.searchContainer}>
                            <div className={styles.searchInputBlock}>
                                <input
                                    className='input search'
                                    type="search"
                                    placeholder="Recherche de sujet"
                                    maxLength={100}
                                    onChange={(e) => { setSearchKeywords(e.target.value) }}
                                    value={searchKeywords}
                                    onKeyDown={e => e.key == 'Enter' && searchSubjects()}
                                />
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className={`${styles.magnifyingGlass} icon`}
                                    onClick={searchSubjects}
                                />
                            </div>

                            <div className={styles.btnContainer}>
                                {userRole === "Admin" &&
                                    <button className={`btn newSubject ${styles.newCategoryBtn}`} onClick={() => toggleModal(setIsCategoryModalOpen, true)}>
                                        Nouvelle catégorie
                                    </button>
                                }
                                {!areCategoriesLoading && categories &&
                                    <button className={`btn newSubject ${styles.newSubjectBtn}`} onClick={() => toggleModal(setIsSubjectModalOpen, true)}>
                                        Nouveau sujet
                                    </button>
                                }
                            </div>
                        </div>


                        {!areCategoriesLoading
                            ?
                            (
                                categories
                                    ?
                                    categoriesElements.sort((a, b) => a.props.title.toLowerCase().localeCompare(b.props.title.toLowerCase()))
                                    :
                                    <p style={{ width: '100%', textAlign: 'center' }}>Il n'y a pas encore de catégories.</p>

                            )
                            :
                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                        }



                    </div>

                    {/* mise en place du modal */}
                    <Modal
                        isOpen={isCategoryModalOpen}
                        onRequestClose={() => toggleModal(setIsCategoryModalOpen, false)}
                        contentLabel="NewCategory Modal"
                        className={styles.Modal}
                        overlayClassName={styles.Overlay}
                        style={customStyles}
                    >
                        {<NewCategory toggleModal={() => toggleModal(setIsCategoryModalOpen, false)} addCategory={addCategory} />}

                    </Modal>


                    {/* mise en place du modal subject */}

                    <Modal
                        isOpen={isSubjectModalOpen}
                        onRequestClose={() => toggleModal(setIsSubjectModalOpen, false)}
                        contentLabel="NewSubject Modal"
                        className={styles.Modal}
                        overlayClassName={styles.Overlay}
                        style={customStylesSubject}
                        shouldCloseOnOverlayClick={false}
                    >
                        {<NewSubjects toggleModal={() => toggleModal(setIsSubjectModalOpen, false)} addSubject={addSubject} />}

                    </Modal>


                    {/* Modal confirmation de suppression des catégories */}

                    <Modal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={closeDeleteModal}
                        contentLabel="Delete Category Modal"
                        className={styles.Modal}
                        overlayClassName={styles.Overlay}
                        style={customStyles}
                        shouldCloseOnOverlayClick={false}
                    >
                        {
                            <div className={styles.deleteContainer}>
                                <p className={`${styles.deleteTitle} ${styles.warning}`}>Attention: En supprimant la catégorie vous effacerez également les sujets qui lui sont associés. </p>
                                <p className={styles.deleteTitle}>Voulez vous quand même continuer? </p>

                                <div className={styles.deleteBtnContainer}>

                                    <button className={`btn newSubject ${styles.deleteBtn}`} onClick={() => deleteCategory(categoryToDelete)}>
                                        Oui
                                    </button>

                                    <button className={`btn login ${styles.deleteBtn}`} onClick={closeDeleteModal}>
                                        Annuler
                                    </button>
                                </div>
                            </div>

                        }
                    </Modal>


                </div >
            </>
    )
}

const customStylesSubject = {
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
        width: '750px',
        height: '90%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"
    },
};



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

export default ForumPage;
