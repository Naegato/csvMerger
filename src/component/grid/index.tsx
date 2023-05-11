import React, { FC, useState } from 'react';
import style from './grid.module.scss';
import { Column } from './colum';

type GridProps = {
  data: any;
  columnLabels: string[];
  setContent: ( content: any ) => void;
};
export const Grid: FC<GridProps> = ( {
  data = {},
  columnLabels = [],
  setContent = () => {},
} ) => {
  const [ numberOfColumns, setNumberOfColumns ] = useState( 1 );

  return <div className={style.grid}>
    <div className={style.controls}>
      <button onClick={() => setNumberOfColumns(x => x+1)}>+</button>
      <button onClick={() => setNumberOfColumns(x => x-1 > 1 ? x-1 : 1)}>-</button>
    </div>
    {new Array( numberOfColumns ).fill( 0 ).map( (_, index ) => {
      return <Column
        key={index}
        id={index}
        columnLabels={columnLabels}
        setMapping={(x) =>
          setContent(content => ({
            ...content,
            [index]: x
          }))
        }
      />
    } )}
  </div>;
};