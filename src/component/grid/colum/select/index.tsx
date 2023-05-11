import style from './select.module.scss';
import { useEffect, useState } from 'react';
import cn from 'classnames';

export const Select = ( { options, isOpen, value, setValue, multiple = false } ) => {
  return <div
    className={style.select}
  >
    <div className={style.selected}>
      {!multiple ? value : Object.keys(value).length > 0 ? Object.keys(value).map((key, index) => <div key={`selected${index}`} className={style.selectedOption}>
        [{key}] {value[key]}
      </div>) : '...'}
    </div>
    <div className={cn(style.options, {[style.active]: isOpen})}>
      {options.map((option, index) => <div
        onClick={() => {
          if ( !multiple ) {
            setValue(option)
            return;
          }

          const keys = Object.keys(value);

          if ( Object.values( value ).includes( option ) ) {
            setValue(value => Object.fromEntries(Object.entries( value )
              .filter( ( [key, value] ) => value !== option )
              .map( ( [key, value], index ) => [index + 1, value] ) ))
            return;
          }

          if (Object.keys(value).length === 0) {
            setValue({1: option})
            return;
          }

          setValue(x => ({...x, [(parseInt(keys.at(-1) || '0') || 0) + 1]: option}))
          return;
        }}
        key={`options${index}`}
        className={style.option}
      >
        {Object.values(value).find(x => x === option) && 'X'} {option}
      </div>)}
    </div>
  </div>;
};