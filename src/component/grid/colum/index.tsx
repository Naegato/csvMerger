import React, { FC, useEffect, useState } from 'react';
import style from './column.module.scss';
import { Select } from './select';
import cn from 'classnames';
import { FUNCTION_MAPPING } from '../../../App';

type ColumnProps = {
  id: number;
  columnLabels: string[];
  setMapping: ( mapping: any ) => void;
}
export const Column: FC<ColumnProps> = ({ id, columnLabels, setMapping }) => {
  const [label, setLabel] = useState<string>('Column ' + (id + 1))
  const [isModified, setIsModified] = useState<boolean>(false)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [isFunctionSelectorSelected, setIsFunctionSelectorSelected ] = useState<boolean>(false)
  const [isColumnSelectorSelected, setIsColumnSelectorSelected] = useState<boolean>(false)
  const [func, setFunc] = useState<string>('...')

  const [value, setValue] = useState<{[key: number]: string }>({})

  useEffect(() => {
    setMapping({ [label]: value, ...(func && {selectedFunc: func}) })
  }, [label, value, func]);

  return <div className={cn(style.column, {[style.active]: id % 2})}>
    <p className={style.header}>
      [{id + 1}]
      {!isModified ? <span onClick={() => !isLocked && setIsModified(true)}>{label}</span> : <input
        className={style.input}
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => {
          setIsModified( false );
          if ( !label ) {
            setLabel( 'Column ' + (id + 1) );
          }
        }}
      />}
      <button onClick={() => setIsLocked(x => !x)}>{isLocked ? '🔒' : '🔓'}</button>
    </p>
    <div className={style.content} tabIndex={0} onFocus={() => !isLocked && setIsColumnSelectorSelected(x => !x)} onBlur={() => setIsColumnSelectorSelected(false)}>
      <Select options={columnLabels} isOpen={isColumnSelectorSelected} setValue={setValue} multiple value={value} />
    </div>
    <div className={style.content} tabIndex={0} onFocus={() => !isLocked && setIsFunctionSelectorSelected(x => !x)} onBlur={() => setIsFunctionSelectorSelected(false)}>
      <Select options={['...', ...Object.keys(FUNCTION_MAPPING)]} isOpen={isFunctionSelectorSelected} setValue={setFunc} value={func} />
    </div>
  </div>;
}