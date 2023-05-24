import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import styles from './column.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock, faLockOpen, faPen, faX } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import { FileColumnProps, FunctionColumnProps } from '@/pages/CsvEditor';

type ColumnProps = {
  setTitle: (name: string) => void,
  title: string,
  setLocked: (locked: boolean) => void,
  locked: boolean,
  handleDelete: () => void,
  labels: FileColumnProps[],
  mapping: string[],
  setMapping: (mapping: string[]) => void,
  functionsColumns: FunctionColumnProps[],
  selectedFunction?: FunctionColumnProps,
  setSelectedFunctions: (functionsColumns: FunctionColumnProps) => void,
  defaultValue: string,
  setDefaultValue: (x: string) => void,
}
export const Column: FC<ColumnProps> = ({
  title,
  setTitle,
  locked,
  setLocked,
  handleDelete,
  labels,
  mapping,
  setMapping,
  functionsColumns,
  setSelectedFunctions,
  selectedFunction,
  defaultValue,
  setDefaultValue,
}) => {
  const [titleValue, setTitleValue] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  return <div className={cn({locked})}>
    <div className={cn(styles.column)}>
      <div className={styles.controls}>
        {!locked && <>
          <button
            onClick={() => {
              if ( titleValue === '' ) {
                toast.error( 'Title cannot be empty' );
                setTitleValue( title );
              } else if ( titleValue.toLowerCase() === 'greg' ) {
                toast.error( 'Greg is not allowed' );
                setTitleValue( title );
              } else {
                setTitle( titleValue );
              }
              setIsEditing( x => !x );
            }}
            className={cn( styles.button, { [styles.edit]: isEditing } )}
          >
            <FontAwesomeIcon icon={isEditing ? faCheck : faPen}/>
          </button>
          <button
            onClick={() => {
              if ( isDeleting ) {
                setIsDeleting( false );
                handleDelete();
              } else {
                setIsDeleting( true );
                setTimeout( () => {
                  setIsDeleting( false );
                }, 2000 );
              }
            }}
            className={cn( styles.button, { [styles.delete]: isDeleting } )}
          >
            <FontAwesomeIcon icon={faX}/>
          </button>
        </>
      }
        <button
          onClick={() => {
            setLocked( !locked );
            setIsEditing( false );
            setIsDeleting( false);
          }}
          className={cn(styles.button, { [styles.locked]: locked })}
        >
          <FontAwesomeIcon icon={locked ? faLock : faLockOpen}/>
        </button>
      </div>
      <div
        className={cn(styles.columnTitle, { [styles.editing]: isEditing })}
        style={{ width: `${titleValue.length}ch` }}
        onDoubleClick={() => {
          if ( !locked ) {
            setIsEditing( true );
          }
        }}
      >
        {isEditing ?
          <input
            className={styles.input}
            value={titleValue}
            onChange={e => setTitleValue( e.target.value )}
            type="text"
            autoFocus
            onKeyPress={e => {
              if ( e.key === 'Enter' ) {
                if ( titleValue === '' ) {
                  toast.error( 'Title cannot be empty' );
                  setTitleValue(title);
                } else if ( titleValue.toLowerCase() === 'greg' ) {
                  toast.error( 'Greg is not allowed' );
                  setTitleValue(title);
                } else {
                  setTitle( titleValue );
                }
                setIsEditing( x => !x );
              }
            }}
          /> :
          <>
            {title}
          </>
        }
      </div>
      <div className={styles.selects}>
        <div className={styles.label}>Mapping :</div>
        <Select
          className={styles.select}
          options={labels}
          isMulti
          closeMenuOnSelect={false}
          onChange={(e) => {
            setMapping( e.map( (x: any) => x.value ) );
          }}
          value={labels.filter( x => mapping.includes( x.value ) )}
        />
        <div className={styles.label}>Fonctions :</div>
        <Select
          className={styles.select}
          options={functionsColumns}
          onChange={(e) => {
            setSelectedFunctions( e as FunctionColumnProps );
          }}
          isClearable
          value={functionsColumns.filter( x => selectedFunction?.value === x.value )}
        />
      </div>
      {selectedFunction?.value === 'default' && <div className={styles.defaultValue}>
        <input
          className={styles.input}
          type="text"
          value={defaultValue}
          onChange={( e ) => setDefaultValue( e.target.value )}
        />
      </div>}
    </div>
  </div>;
}