import { useRouter } from 'next/router';

import styles from '../styles/AnswerPage.module.css';

import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import Header from '../components/Header';
import ForbiddenAccess from '../components/ForbiddenAccess';
import NewAnswer from '../components/ForumComps/NewAnswer';
import Answer from '../components/ForumComps/Answer';

import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';
import { useFetch } from '../hooks';
import toggleModal from '../modules/toggleModal';

Modal.setAppElement('body')

function SubjectPage() {

    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [isAnswerAdded, setIsAnswerAdded] = useState(false);
    const [subject, setSubject] = useState({});
    const [answers, setAnswers] = useState([]);
    const [areAnswersLoading, setAreAnswersLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteModalText, setDeleteModalText] = useState('');

    const router = useRouter();
    const subjectId = router.query.q;
    const categoryId = router.query.r;

    const [answerToDelete, setAnswerToDelete] = useState('');

    const [cookies, setCookies, removeCookies] = useCookies();

    const authConfig = {
        headers: { 'authorization': `Bearer ${cookies.token}` },
    };

    const [userData, userError, isUserLoading] = useFetch(`${process.env.SERVER_ADRESS}/users/currentUser`, authConfig);
    const connectedUser = userData && userData.result && userData.user;

    useEffect(() => {
        if (router.isReady) {
            (async () => {
                const subjectResponse = await fetch(`${process.env.SERVER_ADRESS}/subjects/subject?q=${subjectId}`);
                const subjectData = await subjectResponse.json();

                const answersResponse = await fetch(`${process.env.SERVER_ADRESS}/answers?subject=${subjectId}`);
                const answersData = await answersResponse.json();

                setSubject(subjectData.subject);
                setAnswers(answersData.answers);
                setAreAnswersLoading(false);

            })()
        }
        //router.isReady permet de gérer le cas lorsqu'on actualise la page
    }, [router.isReady, isAnswerAdded])


    {/* Cette modal sert à afficher une variable d'état permettant de supprimer un sujet créer par l'utilisateur l'ayant créé */ }
    const openDeleteModal = (id) => {
        setDeleteModalText(id === subjectId && "Attention: Vous êtes sur le point de supprimer l'intégralité du sujet.")
        setIsDeleteModalOpen(true);
        setAnswerToDelete(id);
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAnswerToDelete('');
    }


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

    const addAnswer = async (dataToSend, imgFile) => {

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

        await fetch(`${process.env.SERVER_ADRESS}/answers/new`, config);
        setIsAnswerAdded(!isAnswerAdded);
        setIsAnswerModalOpen(false);
    };

    {/* La constante deleteAnswer permet de supprimer un sujet et/ou un une réponse créé par l'utilisateur en question.
    Pour se faire, la constante fait un fetch au backend vers la route pour supprimer le sujet et/ou la réponse */}
    const deleteAnswer = async () => {

        const config = {
            method: 'DELETE',
            headers: {
                ...authConfig.headers
            },
        };

        if (answerToDelete == subjectId) {

            config.body = JSON.stringify({ categoryId, subjectId });

            await fetch(`${process.env.SERVER_ADRESS}/subjects/${subjectId}`, config);
            closeDeleteModal();
            router.push('/forum');

        } else {

            await fetch(`${process.env.SERVER_ADRESS}/answers/${answerToDelete}`, config);
            setIsAnswerAdded(!isAnswerAdded);
            closeDeleteModal();
        }
    }

    const listedAnswer = answers && connectedUser ? answers.map((answer, i) => {
        return <Answer key={i} {...answer} connectedUser={connectedUser} openDeleteModal={openDeleteModal} />
    })
        : [];

    subject.title && connectedUser && listedAnswer.unshift(<Answer {...subject} key={listedAnswer.length} connectedUser={connectedUser} openDeleteModal={openDeleteModal} isSubject={true} />);


    return (
        !cookies.token
            ? <ForbiddenAccess />
            :
            <>
                <Header />

                <div className={styles.main}>
                    <div className={styles.container}>

                        <h2 className={styles.answerTo}>Répondre au sujet:</h2>
                        <h3 className={styles.subjectTitle}>{subject.title}</h3>


                        {!areAnswersLoading
                            ?
                            <>
                                {listedAnswer}
                                <div className={styles.btnContainer}>
                                    <button className='btn newSubject' onClick={() => toggleModal(setIsAnswerModalOpen, true)}>
                                        Nouvelle Réponse
                                    </button>
                                </div>
                            </>
                            :
                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                        }

                    </div>

                </div>



                <Modal
                    isOpen={isAnswerModalOpen}
                    onRequestClose={() => toggleModal(setIsAnswerModalOpen, false)}
                    contentLabel="NewAnswer Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                    style={customStylesSubject}
                    shouldCloseOnOverlayClick={false}
                >
                    <NewAnswer subjectId={subjectId} connectedUser={connectedUser} toggleModal={() => toggleModal(setIsAnswerModalOpen, false)} addAnswer={addAnswer} />

                </Modal>


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
                            {deleteModalText && <p className={`${styles.deleteTitle} ${styles.warning}`}> {deleteModalText} </p>}
                            <p className={styles.deleteTitle}>{deleteModalText ? "Voulez vous quand même continuer?" : "Confirmer la suppression de la réponse?"} </p>

                            <div className={styles.deleteBtnContainer}>

                                <button className={`btn newSubject ${styles.deleteBtn}`} onClick={() => deleteAnswer()}>
                                    Oui
                                </button>

                                <button className={`btn login ${styles.deleteBtn}`} onClick={closeDeleteModal}>
                                    Annuler
                                </button>
                            </div>
                        </div>

                    }
                </Modal>

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
        height: '725px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px",
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

export default SubjectPage;
