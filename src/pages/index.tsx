import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './home.module.scss';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCoffee } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import { useAppContext } from '@/component/context/AppContext';

export default function Home() {
  const {files, setFiles} = useAppContext();
  const [isFilesValid, setIsFilesValid] = useState<boolean>(false);

  // use effect to log the files
  // useEffect(() => {
  //   console.log(files);
  // }, [files]);

  useEffect(() => {
    setIsFilesValid(false);
    if (files.length > 0) {
      const fileChecker = new Promise((resolve, reject) => {
        files.forEach((file) => {
          if (file.type !== 'text/csv') {
            reject('success');
          }
        });

        resolve('Succes');
      })

      toast.promise(fileChecker, {
        loading: 'Vérification des fichiers',
        success: () => {
          setIsFilesValid(true);
          return 'Tous les fichiers sont des csv'
        },
        error: () => {
          setIsFilesValid(false);
          setFiles([]);
          return 'Un des fichiers n\'est pas un csv';
        },
      });
    }
  }, [files]);

  return <>
    <Head>
      <title>Téclécharge tes csv</title>
    </Head>
    <Toaster />
    <div className={styles.uploadFiles}>
      <h1 className={styles.title}>Télécharge tes csv</h1>
      <div className={styles.fieldset}>
        <label htmlFor="upload" className={styles.label}>{files.length === 0 ? 'Upload' : files.map( ( file ) => (
          <span key={file.name}>{file.name}</span>
        ) )}</label>
        <input
          id="upload"
          className={styles.input}
          type="file"
          multiple
          onChange={(e) => {
            setFiles(Array.from(e.target.files || []));
          }}
        />
      </div>
      <Link className={cn(styles.nextLink, {[styles.active]: isFilesValid})} href="/CsvEditor">Suivant <span className={styles.icon}><FontAwesomeIcon icon={faArrowRight} fade /></span></Link>
    </div>
  </>
}
