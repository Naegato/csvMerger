import styles from './csvViewer.module.scss';
import { useAppContext } from '@/component/context/AppContext';
import React, { useEffect, useState } from 'react';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';

const CsvViewver = () => {
  const { csv, columns } = useAppContext();
  const router = useRouter();
  const [ href, setHref ] = useState<string>( '' );

  useEffect( () => {
    if ( csv.length === 0 || columns.length === 0 ) {
      toast.error( 'Aucune collonnes' );
      router.push( '/CsvEditor' );
    }

    const parse = Papa.unparse(csv);
    const blob = new Blob([parse], {type: 'text/csv;charset=utf-8'});
    // @ts-ignore
    const url = URL.createObjectURL(blob)

    setHref(url);
  }, [] );


  return <>
    <div className={styles.container}>
      <div className={styles.controller}>
        <button className={styles.button} onClick={() => router.back()}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faArrowLeft}/>
          </span>
          retour
        </button>
        <button className={styles.button} onClick={() => {
          if ( href ) {
            const element = document.createElement("a");
            element.href = href;
            element.download = "myFile.csv";
            document.body.appendChild(element);
            element.click();
          }
        }}>
          Enregistrer au format csv
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faSave}/>
          </span>
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.head}>
          <tr className={styles.row}>
            <td className={styles.cell}>#</td>
            {columns.map( column => <td className={styles.cell}>
              {column.title}
            </td> )}
          </tr>
          </thead>
          <tbody className={styles.body}>
          {csv.map( ( item, i ) => <tr className={styles.row}>
            <td className={styles.cell}>{i + 1}</td>
            {columns.map( column => <td className={styles.cell}>
              {item?.[column.title]}
            </td> )}
          </tr> )}
          </tbody>
        </table>
      </div>
    </div>
  </>;
};

export default CsvViewver;