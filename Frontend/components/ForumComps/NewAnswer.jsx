import styles from '../../styles/NewAnswer.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import Files from 'react-files';
import { Editor } from '@tinymce/tinymce-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import forbiddenWords from '../../modules';


function NewAnswer(props) {

    const subjectId = props.subjectId;
    const [message, setMessage] = useState('');
    const [imgFile, setImgFile] = useState(null);

    const validMessage = message.length > 0

    const tooltipStr = `Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 4.5Mo). <br /> Celle-ci apparaîtra au début de votre réponse.`;

    {/* La constante uploadImage permet de téléverser des images à la route backend pictures */ }
    const uploadImage = async () => {

        const formData = new FormData()

        formData.append('image', imgFile)

        const response = await fetch(`${process.env.SERVER_ADRESS}/pictures/uploadToForum`, { method: 'POST', body: formData })
        const data = await response.json();

        return data.url;
    }

    {/* Permet de créer une nouvelle réponse en faisant un fetch vers la route subjects en faisant une opération CRUD pour post 
    une nouvelle réponse */ }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            message: forbiddenWords(message),
            subjectId,
        };

        props.addAnswer(dataToSend, imgFile);
    };

    const handleChange = (files) => {
        setImgFile(files[0]);        //Permet d'insérer une image dans la réponse
    }

    const handleError = (error, file) => {
        alert("Votre image est trop volumineuse (max 4.5Mo)");
        console.error('error code ' + error.code + ': ' + error.message) //Permet de gérer les erreurs
    }

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>
            <p className={styles.titleSubject} >Créer une nouvelle réponse</p>
            <form onSubmit={handleSubmit}>
                <div className={styles.textSubject}>
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
                </div>
                <div className={styles.formSubject}>

                    <div data-tooltip-id="imgTooltip">
                        <Files
                            className={styles.answerImg}
                            onChange={handleChange}
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

                    {validMessage
                        ?
                        <input className='btn newSubject' type="submit" value="Répondre" />
                        :
                        <button className={`btn ${styles.disabled}`} id="subject">Répondre</button>
                    }
                </div>
            </form>

        </div>
    )
}

export default NewAnswer;