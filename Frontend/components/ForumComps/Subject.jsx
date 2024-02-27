import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/Subject.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEye } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import { useFetch } from '../../hooks';


function Subject(props) {

  const [answers, setAnswers] = useState([]);
  const { _id: subjectId, title, category: categoryId, timeAgo: subjectTimeAgo, numberOfAnswers, views } = props;

  const [answersData, answersError, areAnswersLoading] = useFetch(`${process.env.SERVER_ADRESS}/answers?subject=${subjectId}`);

  if (!answers.length && answersData && answersData.result) setAnswers(answersData.answers);

  let username;
  let profilePicture;
  let timeAgo;

  if (answers.length) {
    // Si le sujet a des réponses

    // Récupération de la dernière réponse
    const lastAnswer = answers[answers.length - 1];

    // Attribution des valeurs de la dernière réponse
    username = lastAnswer.userOwner.username;
    profilePicture = lastAnswer.userOwner.pictureLink;
    timeAgo = lastAnswer.timeAgo;
  } else {
    // Si le sujet n'a pas de réponse

    // Attribution des valeurs initiales du sujet
    username = props.userOwner.username;
    profilePicture = props.userOwner.pictureLink;
    timeAgo = subjectTimeAgo
  }


  return (
    <div className={styles.container}>
      <Link onClick={() => props.incrementViews(subjectId)} href={{ pathname: '/answers', query: { q: subjectId, r: categoryId } }}>
        <p className='subjects'>{title}</p>
      </Link>
      <div className={styles.detailsContainer}>

        <div className={styles.iconsContainer}>
          <div className={styles.infos}>
            <p className={styles.counter}>{answers.length}</p>
            <FontAwesomeIcon icon={faCommentDots} className={`icon ${styles.subjectsIcons}`} />
          </div>
          <div className={styles.infos}>
            <p className={styles.counter}>{views}</p>
            <FontAwesomeIcon icon={faEye} className={`icon ${styles.subjectsIcons}`} />
          </div>

        </div>

        <div className='profileImg'>
          <Image src={profilePicture} width={55} height={55} alt="profileImg" />
        </div>

        <div className={styles.textContainer}>
          <p className={styles.text}>{username}</p>
          <p className={styles.text}>{timeAgo}</p>
        </div>

      </div>
    </div>
  );
}

export default Subject;
