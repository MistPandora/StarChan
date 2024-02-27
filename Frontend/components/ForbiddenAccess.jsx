import { useRouter } from "next/router";

import styles from '../styles/ForbiddenAccess.module.css';


export default function ForbiddenAccess() {
    const router = useRouter();

    setTimeout(() => {
        router.push('/login')
    }, 2000)

    return (
        <div className={styles.container}>
            <h1>403: Vous n'avez pas accès à cette page</h1>
        </div >
    )
};



