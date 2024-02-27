import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/Index.module.css';

import { useState } from 'react';

import { useFetch } from '../hooks/useFetch';

import Header from '../components/Header';
import { Weather, News } from '../components/IndexComps'

import { LoadingIcon } from '../modules';
import '@vivid-planet/react-image/dist/react-image.css';


function IndexPage() {

  const [articlesData, articlesError, isArticlesLoading] = useFetch(`${process.env.SERVER_ADRESS}/news`);
  const [weatherData, weatherError, isWeatherLoading] = useFetch(`${process.env.SERVER_ADRESS}/weather`);
  const [sunData, sunError, isSunLoading] = useFetch(`${process.env.SERVER_ADRESS}/weather/sun`);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  const articleWithImages = articlesData && articlesData.articles.filter(e => e.urlToImage).slice(0, 4);

  const handleClick = () => {
    router.push('/actus')
  }

  const blankArticleBlock = (

    <Link href={!isLogged
      ? {
        pathname: '/login',
        query: { redirect: 'actus' }
      }
      :
      '/actus'
    }
      className={styles.articles} onClick={handleClick}>
      <h3>Voir plus...</h3>
    </Link>
  );

  const articles = articleWithImages && articleWithImages.map((data, i) => (
    <News key={i} {...data} />
  ));


  return (
    <>
      <Head>
        <meta name="description" content="StarChan est un forum de discussion sur l'astronomie intégrant une galerie photo et les dernières actualités." />
        <title>StarChan</title>
      </Head>
      <Header />
      <>
        <h1 className={`title ${styles.homeTitle}`}>Bienvenue sur StarChan</h1>
        <div className={styles.articlesContainer} style={isArticlesLoading ? { alignItems: 'flex-start', justifyContent: 'center' } : {}}>

          {!isArticlesLoading
            ?
            <> {articles} {blankArticleBlock} </>
            :
            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
          }

        </div>
        <Weather weatherData={weatherData} sunData={sunData} />
      </>
    </>
  )
}

export default IndexPage;
