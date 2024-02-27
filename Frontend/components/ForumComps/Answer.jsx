import Image from 'next/image';

import styles from '../../styles/Answer.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import parse from 'html-react-parser';


function Answer(props) {

    const connectedUser = props.connectedUser;
    const isUserAdmin = connectedUser.role === "Admin";
    const { username, _id: userId, role: userRole, pictureLink: profilePicture } = props.userOwner;
    const answerId = props._id;
    const message = props.message;
    const messageImg = props.pictureLink;
    const isSubject = props.isSubject;
    const timeAgo = props.timeAgo;

    return (

        <div className={styles.answerContainer}>
            <Tooltip id="imgTooltip" style={{ zIndex: 10000, maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} />

            <div className={styles.answerDetails} style={isSubject ? { backgroundColor: "#542970" } : {}}>
                <div className={styles.profileImg}>
                    <Image src={profilePicture} width={100} height={100} style={{ borderRadius: '50%' }} alt="profileImg" />
                </div>

                <p className={styles.username}>{username}</p>
                <p className={styles.role} style={userRole === "Admin" ? { fontWeight: "bold" } : {}}>{userRole}</p>
                <p className={styles.timeAgo}>{timeAgo}</p>
                {(isUserAdmin || userId === connectedUser._id) &&
                    <>
                        <div className={styles.trashContainer} onClick={() => props.openDeleteModal(answerId)} data-tooltip-id="imgTooltip" data-tooltip-content={isSubject ? "Supprimer le sujet" : "Supprimer la réponse"}  >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                    </>
                }
            </div>

            <div className={styles.answerTextContainer}>
                {messageImg &&
                    <img src={messageImg} alt="messageImg" className={styles.messageImg} />
                }
                <div className={styles.answerText}>{parse(message)}</div>

            </div>

        </div>
    );
}

export default Answer;