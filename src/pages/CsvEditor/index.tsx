import { useAppContext } from '@/component/context/AppContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import styles from './csvEditor.module.scss';
import { ReactSortable } from 'react-sortablejs';
import { Column } from '@/component/Column';
import cn from 'classnames';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faX } from '@fortawesome/free-solid-svg-icons';

export type ColumnProps = {
  id: number,
  title: string,
  locked: boolean,
  mapping?: string[],
  func?: FunctionColumnProps,
  defaultValue?: string,
}

type CsvProps = {
  [key: string]: any
}

export type FileColumnProps = {
  label: string,
  value: string,
}

export type FunctionColumnProps = {
  label: string,
  value: string,
  func: ( x: FuncProps ) => string,
};

export type FuncProps = {
  fileName: string,
  data: any,
  columnName: string,
  defaultValue: string,
}

const CsvEditor = () => {
  const router = useRouter();
  const { files } = useAppContext();
  const [ filesColumns, setFilesColumns ] = useState<FileColumnProps[]>( [] );
  const [ csv, setCsv ] = useState<CsvProps[]>( [] );
  const [ columns, setColumns ] = useState<ColumnProps[]>( [] );
  const [ fileData, setFileData ] = useState<any>( {} );
  const [ href, setHref ] = useState<string>( '' );
  const [ previewColumns, setPreviewColumns ] = useState<ColumnProps[]>( [] );

  const functionsColumns = useMemo<FunctionColumnProps[]>( () => ([
    {
      label: 'Nom du fichier',
      value: 'file_name',
      func: ( props ) => props.fileName,
    },
    {
      label: 'Valeur par défaut',
      value: 'default',
      func: ( props ) => props.defaultValue,
    },
  ]), [] );

  useEffect( () => {
    const parse = Papa.unparse(csv);
    const blob = new Blob([parse], {type: 'text/csv;charset=utf-8'});
    // @ts-ignore
    const url = URL.createObjectURL(blob)

    setHref(url);
  }, [ previewColumns ] );

  useEffect( () => {
    files.forEach( ( file ) => {
      Papa.parse( file, {
        header: true,
        skipEmptyLines: true,
        complete: function ( results ) {

          setFileData( ( x: any ) => ({ ...x, [file.name]: results.data }) );

          // setFileData( x => ({ ...x,  }))
          setFilesColumns( x =>
            (Array.from(
              new Set(
                [
                  ...(x.map( ( x ) => x.label ) || []),
                  ...(results.meta.fields || []),
                ],
              ),
            )).map( ( label, index ) => ({
                label,
                value: `${index}`,
              }
            ) ),
          );
        },
      } );
    } );
  }, [ files ] );

  const getUniqueTitle = useCallback( ( title: string, index: number, titles: string[] ) => {
    const occurrences = titles.filter( ( t ) => t === title ).length;

    if ( occurrences > 1 ) {
      const suffix = index > 0 ? `(${index})` : '';
      return `${title}${suffix}`;
    }

    return title;
  }, [] );

  useEffect( () => {
    if ( columns.find( x => x === undefined ) ) {
      setColumns( columns.filter( x => x !== undefined ) );
    } else {
      const uniqueColumns = columns.map( ( column ) => {
        const { title, ...rest } = column;
        const uniqueTitle = getUniqueTitle( title, 0, columns.map( ( c ) => c.title ) );
        return { title: uniqueTitle, ...rest };
      } ).reduce( ( acc: ColumnProps[], column: ColumnProps ) => {
        const { title, ...rest } = column;
        const occurrences = acc.filter( ( c: ColumnProps ) => c.title === title ).length;

        if ( occurrences > 0 ) {
          let suffix = occurrences > 1 ? `(${occurrences - 1})` : '(1)';

          while ( acc.filter( ( c: ColumnProps ) => c.title === `${title}${suffix}` ).length > 0 ) {
            suffix = `(${parseInt( suffix.replace( /\(|\)/g, '' ) ) + 1})`;
          }
          acc.push( { title: `${title}${suffix}`, ...rest } );
        } else {
          acc.push( column );
        }

        return acc;

      }, [] );

      if ( JSON.stringify( uniqueColumns ) !== JSON.stringify( columns ) ) {
        setColumns( uniqueColumns );
      }
    }
  }, [ columns ] );

  useEffect( () => {
    if ( files.length === 0 ) {
      toast.error( 'Aucun fichier n\'a été uploadé' );
      router.push( '/' );
    }
  }, [] );

  return <div className={styles.container}>
    <div className={styles.csvEditor}>
      <div className={styles.header}>
        <h1 className={styles.title}>Éditeur de csv :</h1>
        <div className={styles.controls}>
          <button
            className={cn( styles.button )}
            onClick={() => {
              setColumns( columns => [
                ...columns,
                {
                  id: columns.map( ( x ) => x.id ).reduce( ( acc, cur ) => Math.max( acc, cur ), 0 ) + 1,
                  title: `Column ${columns.length + 1}`,
                  locked: false,
                },
              ] );
            }}
          >
            <FontAwesomeIcon icon={faPlus}/>
          </button>
          {columns.length > 2 && <button
            className={cn( styles.button )}
            onClick={() => {
              setColumns( [] );
            }}
          >
            Supprimer tout
            <FontAwesomeIcon icon={faX}/>
          </button>}
        </div>
      </div>

      <ReactSortable
        className={styles.csvEditorContainer}
        list={columns}
        setList={setColumns}
        delay={500}
        delayOnTouchOnly={false}
        chosenClass={styles.chosen}
        filter={'.locked'}
      >
        {columns.map( ( props, index ) => {
            const { id, title, locked, func, mapping, defaultValue } = props;
            return <Column
              defaultValue={defaultValue || ''}
              setDefaultValue={( defaultValue ) => setColumns( items => items.map( ( item ) => item.id === id ? ({
                ...item,
                defaultValue,
              }) : item ) )}
              setSelectedFunctions={( functionsColumns ) => setColumns( items => items.map( ( item ) => item.id === id ? ({
                ...item,
                func: functionsColumns,
              }) : item ) )}
              selectedFunction={func}
              functionsColumns={functionsColumns}
              key={id}
              title={title}
              locked={locked}
              handleDelete={() => setColumns( items => items.filter( ( item ) => item.id !== id ) )}
              setLocked={( locked ) => setColumns( items => items.map( ( item ) => item.id === id ? ({
                ...item,
                locked,
              }) : item ) )}
              setTitle={( title ) => setColumns( items => items.map( ( item ) => item.id === id ? ({
                ...item,
                title,
              }) : item ) )}
              labels={filesColumns}
              mapping={mapping || []}
              setMapping={( mapping ) => setColumns( items => items.map( ( item ) => item.id === id ? ({
                ...item,
                mapping,
              }) : item ) )}
            />;
          },
        )}
      </ReactSortable>
      <div className={styles.command}>
        <button
          className={cn( styles.button )}
          onClick={() => {
            if ( columns.length === 0 ) {
              toast.error( 'Aucune colonne n\'a été ajoutée' );
              return;
            }

            const transformedFileData = Object.keys( fileData ).flatMap( ( fileName ) =>
              fileData[fileName].map( ( data: any ) => ({ [fileName]: data }) ),
            );

            const csv = transformedFileData.map( ( file: any ) => {
              const [ fileName, data ]: [ string, any ] = Object.entries( file )[0];
              return columns.reduce( ( acc: any, column: ColumnProps ) => {
                const mapping = column.mapping?.find( ( x ) => data?.[filesColumns[parseInt( x )]?.label] );
                return {
                  ...acc,
                  [column.title]: data?.[filesColumns?.[parseInt( mapping || '' )]?.label] || column?.func?.func?.( {
                    fileName,
                    data,
                    columnName: column.title,
                    defaultValue: column.defaultValue || '',
                  } ),
                };
              }, {} );
            } );

            setCsv( csv );
            setPreviewColumns( columns );
          }}
        >
          Voir l'aperçu
        </button>
        {csv.length !== 0 && previewColumns.length !== 0 && <button
          className={cn( styles.button )}
          onClick={() => {
            setPreviewColumns( [] );
          }}
        >
          Cacher l'aperçu
        </button>}
      </div>
    </div>
    {csv.length !== 0 && previewColumns.length !== 0 && <div className={styles.containerViewer}>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.head}>
          <tr className={styles.row}>
            <td className={styles.cell}>#</td>
            {previewColumns.map( previewColumn => <td className={styles.cell}>
              {previewColumn.title}
            </td> )}
          </tr>
          </thead>
          <tbody className={styles.body}>
          {csv.map( ( item, i ) => <tr className={styles.row}>
            <td className={styles.cell}>{i + 1}</td>
            {previewColumns.map( previewColumn => <td className={styles.cell}>
              {item?.[previewColumn.title]}
            </td> )}
          </tr> )}
          </tbody>
        </table>
      </div>
      <div className={styles.controller}>
        <button className={styles.button} onClick={() => {
          if ( href ) {
            const element = document.createElement( 'a' );
            element.href = href;
            element.download = 'myFile.csv';
            document.body.appendChild( element );
            element.click();
          }
        }}>
          Enregistrer au format csv
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faSave}/>
          </span>
        </button>
      </div>
    </div>}
  </div>;
};

export default CsvEditor;