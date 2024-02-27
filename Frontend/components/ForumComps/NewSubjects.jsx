import styles from '../../styles/NewSubject.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import Files from 'react-files';
import Select from 'react-select';
import { Editor } from "@tinymce/tinymce-react";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { useFetch } from '../../hooks';

import forbiddenWords from '../../modules/forbiddenWords';


function NewSubjects(props) {

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subjectTitle, setSubjectTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imgFile, setImgFile] = useState(null);

    const isTitleValid = subjectTitle.length > 0;
    const isMessageValid = message.length > 0;
    const isCategoryValid = selectedCategory && selectedCategory.value;

    const isFormValid = isTitleValid && isMessageValid && isCategoryValid;

    const [categoriesData, categoriesError, areCategoriesLoading] = useFetch(`${process.env.SERVER_ADRESS}/categories`);

    const categories = categoriesData
        ? categoriesData.categories.map(categorie => {
            return (
                { value: categorie.title, label: categorie.title }
            )
        })
        : [];

    const tooltipStr = "Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 4.5Mo). <br /> Celle-ci apparaîtra au début de votre réponse.";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            subjectTitle: forbiddenWords(subjectTitle),
            categoryTitle: selectedCategory.value,
            message: forbiddenWords(message),
        };
        props.addSubject(dataToSend, imgFile);
    };

    const handleFileChange = (files) => {
        setImgFile(files[0] ? files[0] : null);
    };

    const handleError = () => {
        alert("Votre image est trop volumineuse (max 4.5Mo)");
    };

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.toggleModal()} />
            </div>

            <p className={styles.titleSubject} >Créer un nouveau sujet</p>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <div className={styles.identifySubject}>
                        <Select options={categories} onChange={e => setSelectedCategory(e)} name="category" value={selectedCategory} placeholder="Veuillez sélectionner une catégorie" />
                    </div>

                    {!isCategoryValid &&
                        <p className={styles.warning}>Veuillez choisir une catégorie</p>
                    }
                </div>
                <div className={styles.inputContainer}>
                    <input className={`input ${styles.inputText}`} onChange={e => setSubjectTitle(e.target.value)} name="title" value={subjectTitle} type="text" placeholder="Titre" />
                    {!isTitleValid
                        && <p className={styles.warning}>Veuillez remplir ce champ</p>
                    }
                </div>


                <div className={styles.formSubject}>

                    <Editor
                        onEditorChange={setMessage}
                        name="message"
                        value={message}
                        apiKey={process.env.EDITOR_API_KEY}
                        initialValue=""
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                    />
                    <div className={styles.textSubject}>
                        {!isMessageValid &&
                            <p className={`${styles.warning} ${styles.editorWarning}`}>Veuillez remplir ce champ</p>
                        }
                    </div>
                </div>

                <div className={styles.bottomContainer}>

                    <div data-tooltip-id="imgTooltip">
                        <Files
                            className={styles.subjectImg}
                            onChange={handleFileChange}
                            onError={handleError}
                            accepts={['image/png', 'image/jpg', 'image/jpeg']}
                            maxFileSize={4500000}
                            minFileSize={0}
                            clickable>
                            {imgFile
                                ?
                                <img src={imgFile.preview.url ? imgFile.preview.url : ''} alt="Insérer une image" />
                                :
                                <p className={styles.insertImg}>Insérer une image</p>
                            }
                        </Files>
                    </div>

                    <Tooltip id="imgTooltip" className={styles.imgTooltip} html={tooltipStr} />

                    <div>
                        {isFormValid
                            ?
                            <input className={'btn newSubject'} type="submit" value="Créer le sujet" />
                            :
                            <button className={`btn ${styles.disabled}`}>Créer le sujet</button>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}



export default NewSubjects;