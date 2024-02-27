import styles from '../../styles/Category.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import Subject from './Subject';


function Category(props) {

  const matchingSubjects = props.matchingSubjects;
  const searching = props.searching;
  const [subjectsElements, setSubjectsElements] = useState([]);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);
  const categoryId = props.id;
  const userRole = props.userRole;

  const getCategory = async () => {
    try {
      const categoryResponse = await fetch(`${process.env.SERVER_ADRESS}/categories/${categoryId}`);
      const categoryData = await categoryResponse.json();

      return categoryData.category;

    } catch (error) {
      console.error('An error occurred:', error.message);
      return null;
    }
  };

  const getSubjects = async (category) => {

    const subjects = await Promise.all(category.subjects.map(async (subject) => {
      try {
        const response = await fetch(`${process.env.SERVER_ADRESS}/subjects/subject?q=${subject._id}`);
        const data = await response.json();

        return data.subject;
      } catch (error) {
        console.error('An error occurred while getting the subjects:', error.message);
        return null
      }
    }));
    const searchingSubjects = subjects.filter(subject => {
      return matchingSubjects.some(matchingSubject => matchingSubject._id === subject._id)
    })

    console.log(subjects);
    return searching ? searchingSubjects : subjects;
  };

  const incrementViews = async (subjectId) => {
    const config = {
      method: "PATCH",
    }
    await fetch(`${process.env.SERVER_ADRESS}/subjects/subject?q=${subjectId}`, config)
  }

  useEffect(() => {
    (async () => {
      try {
        const category = await getCategory();
        const subjects = await getSubjects(category);

        setSubjectsElements(
          subjects.map((subject, i) => {
            return <Subject key={i} {...subject} incrementViews={incrementViews} />
          })
        );

        setSubjectsLoaded(true);

      } catch (error) {
        console.error('An error occurred:', error.message);
      }

    })()
  }, [props.isSubjectAdded, props.matchingSubjects, props.searching])


  const preventDisplayEmptyCategories = searching && !subjectsElements.length; // Si on est en train de chercher ET qu'on n'a pas de sujet dans les catégories, on renvoie true

  return (
    subjectsLoaded &&
    <>
      {!preventDisplayEmptyCategories &&
        <div className={styles.container}>

          <div className={styles.header}>
            <h2 className='categories'> {props.title} </h2>

            {userRole === "Admin" &&

              <>
                <div className={styles.trashContainer} onClick={() => props.openDeleteModal(categoryId)} data-tooltip-id="imgTooltip" data-tooltip-content={"Supprimer la catégorie"} >
                  <FontAwesomeIcon icon={faTrashCan} />
                </div>
                <Tooltip id="imgTooltip" className={styles.trashTooltip} />
              </>
            }
          </div>

          <div className={styles.subjectsContainer}>
            {
              subjectsElements.sort((a, b) => {
                // Récupération des dates de création des sujets A et B
                const creationDateSubjectA = a.props.creationDate;
                const creationDateSubjectB = b.props.creationDate;

                if (b.props.answers.length) {
                  // Si le sujet B a des réponses, récupération de la date de la dernière réponse
                  const lastAnswerDateSubjectB = b.props.answers[b.props.answers.length - 1].date;

                  if (a.props.answers.length) {
                    // Si le sujet A a des réponses, récupération de la date de la dernière réponse
                    const lastAnswerDateSubjectA = a.props.answers[a.props.answers.length - 1].date;

                    // Comparaison des dates de dernière réponse pour le tri
                    return new Date(lastAnswerDateSubjectB) - new Date(lastAnswerDateSubjectA);
                  } else {
                    // Si le sujet A n'a pas de réponse, comparaison avec sa date de création
                    return new Date(lastAnswerDateSubjectB) - new Date(creationDateSubjectA);
                  }
                } else {
                  // Si le sujet B n'a pas de réponse
                  if (a.props.answers.length) {
                    // Si le sujet A a des réponses, récupération de la date de la dernière réponse
                    const lastAnswerDateSubjectA = a.props.answers[a.props.answers.length - 1].date;

                    // Comparaison avec la date de création du sujet B
                    return new Date(creationDateSubjectB) - new Date(lastAnswerDateSubjectA);
                  } else {
                    // Si le sujet A et le sujet B n'ont pas de réponse, comparaison des dates de création
                    return new Date(creationDateSubjectB) - new Date(creationDateSubjectA);
                  }
                }
              })
            }
          </div>

        </div>
      }
    </>
  );
}

export default Category;
