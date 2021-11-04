import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { DrupalState } from '@pantheon/decoupled-node-sdk';

import styles from '../styles/Home.module.css'

const drupalUrl = process.env.backendUrl;

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Decoupled Next Drupal Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="prose lg:prose-xl mt-6">
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          <div className="bg-black text-white rounded flex items-center justify-center p-4">Decoupled hosting by{' '}<Image src="/pantheon.svg" className="-top-28" alt="Pantheon Logo" width={191} height={60} /></div>
        </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-screen-lg">
          {/* Check to see if this is an object before mapping */}
          {articles.map(article => {
            const imgSrc = drupalUrl + article.field_media_image.field_media_image.uri.url;
            return (
              <Link passHref href={article.path.alias} key={article.id}>
                <div className="flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 hover:border-indigo-500">
                  <div className="flex-shrink-0 relative h-40">
                    <Image src={imgSrc} layout="fill" objectFit="cover" alt={article.field_media_image.field_media_image.resourceIdObjMeta.alt} />
                  </div>
                  <h2 className="my-4 mx-6 text-xl leading-7 font-semibold text-gray-900">{article.title} &rarr;</h2>
                </div>
              </Link>
            )})
          }
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  // TODO - determine apiRoot from environment variables
  const store = new DrupalState({
    apiRoot: `${drupalUrl}/en/jsonapi`,
  });

  store.params.addInclude(['field_media_image.field_media_image']);
  const articles = await store.getObject({ objectName: 'node--article', res: context.res });

  // The calls below are unnecessary for rendering the page, but demonstrates
  // both that surrogate keys are de-duped when added to the response, and also
  // that they are bubbled up for GraphQL link queries.

  // A duplicate resource to ensure that keys are de-duped.
  await store.getObject({
    objectName: 'node--article',
    id: 'e481c1f5-e475-4ce6-8c15-a0c2c8e5a15f',
    query: `{
      id
      title
    }`,
    res: context.res
  });
  store.params.clear();

  // A new resource to ensure that keys are bubbled up.
  await store.getObject({
    objectName: 'node--page',
    query: `{
      id
      title
    }`,
    res: context.res
  });

  return {
    props: { articles },
  }
}