import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { FunctionColumnProps } from '@/pages/CsvEditor';

export type ColumnProps = {
  id: number,
  title: string,
  locked: boolean,
  mapping?: string[],
  func?: FunctionColumnProps,
  defaultValue?: string,
}

type CsvProps = {
  [ key: string ]: any
}

export type AppContextType = {
  files: File[],
  setFiles: Dispatch<SetStateAction<File[]>>,
  csv: CsvProps[],
  setCsv: Dispatch<SetStateAction<CsvProps[]>>,
  columns: ColumnProps[],
  setColumns: Dispatch<SetStateAction<ColumnProps[]>>,
}

export const AppContext = createContext<AppContextType>({
  files: [],
  setFiles: () => {},
  csv: [],
  setCsv: () => {},
  columns: [],
  setColumns: () => {},
});

export const AppContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [ csv, setCsv ] = useState<CsvProps[]>([]);
  const [ columns, setColumns ] = useState<ColumnProps[]>( [] );

  return <AppContext.Provider
    value={{
      files,
      setFiles,
      csv,
      setCsv,
      columns,
      setColumns,
    }}
  >
    {children}
  </AppContext.Provider>
}

export const useAppContext: () => AppContextType = () => {
  return useContext(AppContext);
}